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
 * Eventos: checkout.session.completed, invoice.paid,
 *   invoice.payment_failed, customer.subscription.deleted
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

async function resolveUserIdBySubscriptionId(
  supabase: SupabaseClient,
  subscriptionId: string,
): Promise<string | null> {
  const { data } = await supabase
    .from('subscriptions')
    .select('user_id')
    .eq('stripe_subscription_id', subscriptionId)
    .maybeSingle()
  return data?.user_id ?? null
}

async function resolveUserIdByCustomerId(
  supabase: SupabaseClient,
  customerId: string,
): Promise<string | null> {
  const { data } = await supabase
    .from('subscriptions')
    .select('user_id')
    .eq('stripe_customer_id', customerId)
    .order('updated_at', { ascending: false })
    .limit(1)
    .maybeSingle()
  return data?.user_id ?? null
}

async function handleWebhookEvent(supabase: SupabaseClient, event: Stripe.Event) {
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
        typeof session.subscription === 'string' ? session.subscription : session.subscription?.id
      const custId = typeof session.customer === 'string' ? session.customer : session.customer?.id
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

    case 'invoice.paid': {
      const invoice = event.data.object as Stripe.Invoice
      const subId =
        typeof invoice.subscription === 'string'
          ? invoice.subscription
          : invoice.subscription?.id ?? null
      if (!subId) {
        console.error('invoice.paid: missing subscription id')
        break
      }

      const sub = await stripe.subscriptions.retrieve(subId)
      let userId =
        typeof sub.metadata?.supabase_user_id === 'string' && looksLikeUuid(sub.metadata.supabase_user_id)
          ? sub.metadata.supabase_user_id
          : null
      if (!userId) {
        userId = await resolveUserIdBySubscriptionId(supabase, sub.id)
      }
      if (!userId) {
        const custId = typeof sub.customer === 'string' ? sub.customer : sub.customer?.id
        if (custId) userId = await resolveUserIdByCustomerId(supabase, custId)
      }
      if (!userId) {
        console.error('invoice.paid: could not resolve user id')
        break
      }

      await persistSubscriptionAndProfile(supabase, userId, sub)
      break
    }

    case 'invoice.payment_failed': {
      const invoice = event.data.object as Stripe.Invoice
      const subId =
        typeof invoice.subscription === 'string'
          ? invoice.subscription
          : invoice.subscription?.id ?? null
      const custId =
        typeof invoice.customer === 'string' ? invoice.customer : invoice.customer?.id ?? null

      let userId: string | null = null
      if (subId) {
        userId = await resolveUserIdBySubscriptionId(supabase, subId)
      }
      if (!userId && custId) {
        userId = await resolveUserIdByCustomerId(supabase, custId)
      }
      if (!userId) {
        console.error('invoice.payment_failed: could not resolve user id')
        break
      }

      if (subId) {
        const { error: upErr } = await supabase
          .from('subscriptions')
          .update({
            status: 'past_due',
            updated_at: new Date().toISOString(),
          })
          .eq('stripe_subscription_id', subId)
        if (upErr) console.error('subscriptions update (invoice.payment_failed):', upErr)
      }

      const { error: pErr } = await supabase
        .from('profiles')
        .update({ plan: 'free', billing_status: 'past_due' })
        .eq('id', userId)
      if (pErr) console.error('profiles update (invoice.payment_failed):', pErr)
      break
    }

    case 'customer.subscription.deleted': {
      const sub = event.data.object as Stripe.Subscription
      let userId: string | null =
        typeof sub.metadata?.supabase_user_id === 'string' ? sub.metadata.supabase_user_id : null
      if (!userId) {
        userId = await resolveUserIdBySubscriptionId(supabase, sub.id)
      }
      if (!userId) {
        const custId = typeof sub.customer === 'string' ? sub.customer : sub.customer?.id
        if (custId) userId = await resolveUserIdByCustomerId(supabase, custId)
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
  const work = handleWebhookEvent(supabase, event).catch((e) => {
    console.error('Webhook handler error:', e)
  })

  // Responde 200 inmediatamente para evitar reintentos por timeout de Stripe.
  // En Supabase Edge, waitUntil mantiene la tarea viva en segundo plano.
  // deno-lint-ignore no-explicit-any
  const edgeRuntime = (globalThis as any).EdgeRuntime
  if (edgeRuntime?.waitUntil) edgeRuntime.waitUntil(work)

  return new Response(JSON.stringify({ received: true }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  })
})
