/**
 * Resincroniza public.subscriptions + profiles.plan desde Stripe (por si el webhook falló).
 * JWT de usuario requerido. Secrets: STRIPE_SECRET_KEY
 * Deploy: supabase functions deploy sync-stripe-subscription --no-verify-jwt
 */

import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'
import Stripe from 'https://esm.sh/stripe@14.21.0?target=deno'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.1'

const corsHeaders: Record<string, string> = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Max-Age': '86400',
}

const ACTIVE_LIKE = ['active', 'trialing', 'past_due']

function profilePlanFromMetadata(tier: string | null | undefined): string {
  const t = String(tier || 'pro').toLowerCase()
  return t === 'business' ? 'business' : 'pro'
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const stripeSecret = Deno.env.get('STRIPE_SECRET_KEY')
    if (!stripeSecret) {
      return new Response(JSON.stringify({ ok: false, message: 'STRIPE_SECRET_KEY no configurada' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')
    const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
    if (!supabaseUrl || !serviceKey) {
      return new Response(JSON.stringify({ ok: false, message: 'Supabase misconfigurado' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const authHeader = req.headers.get('Authorization')
    const token = authHeader?.replace(/^Bearer\s+/i, '')?.trim()
    if (!token) {
      return new Response(JSON.stringify({ ok: false, message: 'Authorization Bearer requerido' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const supabase = createClient(supabaseUrl, serviceKey)
    const {
      data: { user },
      error: userErr,
    } = await supabase.auth.getUser(token)
    if (userErr || !user?.id || !user.email) {
      return new Response(JSON.stringify({ ok: false, message: 'Sesión inválida' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const stripe = new Stripe(stripeSecret, {
      httpClient: Stripe.createFetchHttpClient(),
      apiVersion: '2023-10-16',
    })

    let customerId: string | null = null

    const { data: row } = await supabase
      .from('subscriptions')
      .select('stripe_customer_id')
      .eq('user_id', user.id)
      .order('updated_at', { ascending: false })
      .limit(1)
      .maybeSingle()

    if (row?.stripe_customer_id) {
      customerId = row.stripe_customer_id
    } else {
      const customers = await stripe.customers.list({ email: user.email, limit: 5 })
      customerId = customers.data[0]?.id ?? null
    }

    if (!customerId) {
      return new Response(
        JSON.stringify({
          ok: false,
          message:
            'No hay cliente en Stripe con tu email. Si acabas de pagar, espera unos segundos o revisa que el pago sea en el mismo modo (test/live) que tu clave STRIPE_SECRET_KEY.',
        }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      )
    }

    const subs = await stripe.subscriptions.list({
      customer: customerId,
      status: 'all',
      limit: 15,
    })

    const pick = subs.data.find((s) => ACTIVE_LIKE.includes(s.status))
    if (!pick) {
      return new Response(
        JSON.stringify({
          ok: false,
          message: 'Stripe no tiene una suscripción activa/trial para este cliente.',
        }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      )
    }

    const priceId = pick.items.data[0]?.price?.id ?? null
    const periodEnd = pick.current_period_end
      ? new Date(pick.current_period_end * 1000).toISOString()
      : null
    const now = new Date().toISOString()

    const { error: subErr } = await supabase.from('subscriptions').upsert(
      {
        user_id: user.id,
        stripe_customer_id: customerId,
        stripe_subscription_id: pick.id,
        status: pick.status,
        price_id: priceId,
        current_period_end: periodEnd,
        updated_at: now,
      },
      { onConflict: 'stripe_subscription_id' },
    )
    if (subErr) {
      console.error(subErr)
      return new Response(JSON.stringify({ ok: false, message: subErr.message }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const plan = profilePlanFromMetadata(pick.metadata?.plan_tier)
    const { error: pErr } = await supabase
      .from('profiles')
      .update({ plan, billing_status: 'active' })
      .eq('id', user.id)
    if (pErr) {
      console.error(pErr)
      return new Response(JSON.stringify({ ok: false, message: pErr.message }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    return new Response(JSON.stringify({ ok: true, status: pick.status }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e)
    console.error(e)
    return new Response(JSON.stringify({ ok: false, message: msg }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})
