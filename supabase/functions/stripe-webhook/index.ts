/**
 * Stripe → Supabase: verificación por firma + actualización de profiles y subscriptions.
 *
 * Secrets (Dashboard → Edge Functions → Secrets o CLI):
 *   STRIPE_SECRET_KEY
 *   STRIPE_WEBHOOK_SECRET   (whsec_... del endpoint en Stripe o `stripe listen`)
 *   (SUPABASE_SERVICE_ROLE_KEY la inyecta Supabase en deploy; no uses secrets con prefijo SUPABASE_)
 * SUPABASE_URL se inyecta automáticamente.
 *
 * Deploy:
 *   supabase functions deploy stripe-webhook --no-verify-jwt
 *
 * Stripe Dashboard → Webhooks → URL:
 *   https://<PROJECT_REF>.supabase.co/functions/v1/stripe-webhook
 * Eventos: checkout.session.completed, customer.subscription.created,
 *   customer.subscription.updated, customer.subscription.deleted
 */

import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'
import Stripe from 'https://esm.sh/stripe@14.21.0?target=deno'
import { createClient, SupabaseClient } from 'https://esm.sh/@supabase/supabase-js@2.49.1'

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') ?? '', {
  httpClient: Stripe.createFetchHttpClient(),
  apiVersion: '2023-10-16',
})

function profilePlanFromMetadata(tier: string | null | undefined): string {
  const t = String(tier || 'pro').toLowerCase()
  return t === 'business' ? 'business' : 'pro'
}

function looksLikeUuid(s: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
    s.trim(),
  )
}

/** Guarda subscriptions + perfil Pro; planTierOverride viene del Checkout Session si hace falta. */
async function persistSubscriptionAndProfile(
  supabase: SupabaseClient,
  userId: string,
  sub: Stripe.Subscription,
  planTierOverride?: string | null,
) {
  const custId = typeof sub.customer === 'string' ? sub.customer : sub.customer?.id
  if (!custId) {
    console.error('persistSubscriptionAndProfile: missing customer id')
    return
  }
  const priceId = sub.items.data[0]?.price?.id ?? null
  const periodEnd = sub.current_period_end
    ? new Date(sub.current_period_end * 1000).toISOString()
    : null
  const now = new Date().toISOString()

  const { error: subErr } = await supabase.from('subscriptions').upsert(
    {
      user_id: userId,
      stripe_customer_id: custId,
      stripe_subscription_id: sub.id,
      status: sub.status,
      price_id: priceId,
      current_period_end: periodEnd,
      updated_at: now,
    },
    { onConflict: 'stripe_subscription_id' },
  )
  if (subErr) console.error('subscriptions upsert:', subErr)

  const tier =
    planTierOverride !== undefined && planTierOverride !== null && String(planTierOverride).trim() !== ''
      ? planTierOverride
      : sub.metadata?.plan_tier
  const plan = profilePlanFromMetadata(tier)
  const activeLike = ['active', 'trialing', 'past_due'].includes(sub.status)
  if (activeLike) {
    const { error: profErr } = await supabase
      .from('profiles')
      .update({ plan, billing_status: 'active' })
      .eq('id', userId)
    if (profErr) console.error('profiles update (subscription sync):', profErr)
  }
}

serve(async (req) => {
  if (req.method !== 'POST') {
    return new Response('Method Not Allowed', { status: 405 })
  }

  const webhookSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET')
  if (!webhookSecret) {
    console.error('STRIPE_WEBHOOK_SECRET missing')
    return new Response(JSON.stringify({ error: 'Server misconfigured' }), { status: 500 })
  }

  const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
  const supabaseUrl = Deno.env.get('SUPABASE_URL')
  if (!serviceKey || !supabaseUrl) {
    console.error('Supabase env missing')
    return new Response(JSON.stringify({ error: 'Server misconfigured' }), { status: 500 })
  }

  const body = await req.text()
  const sig = req.headers.get('stripe-signature')
  if (!sig) {
    return new Response(JSON.stringify({ error: 'No Stripe-Signature header' }), { status: 400 })
  }

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret)
  } catch (err) {
    console.error('Webhook signature verification failed:', err)
    return new Response(JSON.stringify({ error: 'Invalid signature' }), { status: 400 })
  }

  const supabase = createClient(supabaseUrl, serviceKey)

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session
        if (session.mode !== 'subscription') break

        const fromMeta =
          typeof session.metadata?.supabase_user_id === 'string'
            ? session.metadata.supabase_user_id.trim()
            : ''
        const fromClientRef =
          typeof session.client_reference_id === 'string' ? session.client_reference_id.trim() : ''
        const userId =
          (fromMeta && looksLikeUuid(fromMeta) ? fromMeta : '') ||
          (fromClientRef && looksLikeUuid(fromClientRef) ? fromClientRef : '') ||
          null

        if (!userId) {
          console.error(
            'checkout.session.completed: missing valid user id (metadata.supabase_user_id or client_reference_id UUID)',
          )
          break
        }

        const subId =
          typeof session.subscription === 'string'
            ? session.subscription
            : session.subscription?.id
        const custId =
          typeof session.customer === 'string' ? session.customer : session.customer?.id
        if (!subId || !custId) {
          console.error('checkout.session.completed: missing subscription or customer id')
          break
        }

        const sub = await stripe.subscriptions.retrieve(subId)
        await persistSubscriptionAndProfile(
          supabase,
          userId,
          sub,
          session.metadata?.plan_tier ?? undefined,
        )
        break
      }

      case 'customer.subscription.created': {
        const sub = event.data.object as Stripe.Subscription
        const raw =
          typeof sub.metadata?.supabase_user_id === 'string' ? sub.metadata.supabase_user_id.trim() : ''
        if (!raw || !looksLikeUuid(raw)) {
          console.error('customer.subscription.created: missing metadata.supabase_user_id (UUID)')
          break
        }
        await persistSubscriptionAndProfile(supabase, raw, sub)
        break
      }

      case 'customer.subscription.updated': {
        const sub = event.data.object as Stripe.Subscription
        let userId: string | undefined =
          typeof sub.metadata?.supabase_user_id === 'string' ? sub.metadata.supabase_user_id : undefined
        if (!userId || !looksLikeUuid(userId)) {
          const { data } = await supabase
            .from('subscriptions')
            .select('user_id')
            .eq('stripe_subscription_id', sub.id)
            .maybeSingle()
          userId = data?.user_id ?? undefined
        }

        const periodEnd = sub.current_period_end
          ? new Date(sub.current_period_end * 1000).toISOString()
          : null
        const priceId = sub.items.data[0]?.price?.id ?? null
        const now = new Date().toISOString()

        const { error: upErr } = await supabase
          .from('subscriptions')
          .update({
            status: sub.status,
            current_period_end: periodEnd,
            price_id: priceId,
            updated_at: now,
          })
          .eq('stripe_subscription_id', sub.id)
        if (upErr) console.error('subscriptions update (subscription.updated):', upErr)

        if (userId) {
          const activeLike = ['active', 'trialing', 'past_due'].includes(sub.status)
          if (activeLike) {
            const plan = profilePlanFromMetadata(sub.metadata?.plan_tier)
            const { error: pErr } = await supabase
              .from('profiles')
              .update({ plan, billing_status: 'active' })
              .eq('id', userId)
            if (pErr) console.error('profiles update (reactivated):', pErr)
          } else if (
            sub.status === 'canceled' ||
            sub.status === 'unpaid' ||
            sub.status === 'incomplete_expired'
          ) {
            const { error: pErr } = await supabase
              .from('profiles')
              .update({ plan: 'free', billing_status: sub.status })
              .eq('id', userId)
            if (pErr) console.error('profiles update (downgrade):', pErr)
          }
        }
        break
      }

      case 'customer.subscription.deleted': {
        const sub = event.data.object as Stripe.Subscription
        let userId: string | undefined = sub.metadata?.supabase_user_id
        if (!userId) {
          const { data } = await supabase
            .from('subscriptions')
            .select('user_id')
            .eq('stripe_subscription_id', sub.id)
            .maybeSingle()
          userId = data?.user_id ?? undefined
        }

        const now = new Date().toISOString()
        const { error: upErr } = await supabase
          .from('subscriptions')
          .update({
            status: 'canceled',
            updated_at: now,
          })
          .eq('stripe_subscription_id', sub.id)
        if (upErr) console.error('subscriptions update (deleted):', upErr)

        if (userId) {
          const { error: pErr } = await supabase
            .from('profiles')
            .update({ plan: 'free', billing_status: 'canceled' })
            .eq('id', userId)
          if (pErr) console.error('profiles update (subscription deleted):', pErr)
        }
        break
      }

      default:
        break
    }
  } catch (e) {
    console.error('Webhook handler error:', e)
    return new Response(JSON.stringify({ error: 'Handler failed' }), { status: 500 })
  }

  return new Response(JSON.stringify({ received: true }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  })
})
