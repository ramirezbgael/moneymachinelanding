// Stripe Checkout — sesión ligada al usuario autenticado (JWT), sin confiar en el body.
// Secrets: STRIPE_SECRET_KEY. SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY las inyecta Supabase (no secrets set SUPABASE_*).
// Deploy: supabase functions deploy create-checkout-session --no-verify-jwt

import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'
import Stripe from 'https://esm.sh/stripe@14.21.0?target=deno'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.1'

const corsHeaders: Record<string, string> = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Max-Age': '86400',
}

const ACTIVE_SUB_STATUSES = ['active', 'trialing', 'past_due']

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const stripeSecret = Deno.env.get('STRIPE_SECRET_KEY')
    if (!stripeSecret) {
      return new Response(JSON.stringify({ error: 'STRIPE_SECRET_KEY no configurada' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')
    const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
    if (!supabaseUrl || !serviceKey) {
      return new Response(JSON.stringify({ error: 'SUPABASE_SERVICE_ROLE_KEY o URL faltante' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const authHeader = req.headers.get('Authorization')
    const token = authHeader?.replace(/^Bearer\s+/i, '')?.trim()
    if (!token) {
      return new Response(JSON.stringify({ error: 'Authorization Bearer requerido' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const supabase = createClient(supabaseUrl, serviceKey)
    const {
      data: { user },
      error: userErr,
    } = await supabase.auth.getUser(token)
    if (userErr || !user?.id) {
      return new Response(JSON.stringify({ error: 'Sesión inválida o expirada' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const body = await req.json().catch(() => ({}))
    const priceId = body.priceId as string | undefined
    const mode = body.mode === 'payment' ? 'payment' : 'subscription'
    const rawTier = body.planTier as string | undefined
    const planTier = rawTier === 'business' ? 'business' : 'pro'
    const successUrl =
      (body.successUrl as string) || `${req.headers.get('origin') ?? ''}/dashboard?checkout=success`
    const cancelUrl = (body.cancelUrl as string) || `${req.headers.get('origin') ?? ''}/pricing`

    if (!priceId || typeof priceId !== 'string' || !priceId.startsWith('price_')) {
      return new Response(JSON.stringify({ error: 'priceId inválido (debe ser price_...)' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    if (mode === 'subscription') {
      const { data: activeSub } = await supabase
        .from('subscriptions')
        .select('id')
        .eq('user_id', user.id)
        .in('status', ACTIVE_SUB_STATUSES)
        .limit(1)
        .maybeSingle()

      if (activeSub) {
        return new Response(
          JSON.stringify({
            error: 'already_subscribed',
            message: 'Ya tienes una suscripción activa. Gestiónala desde el portal de facturación o cancela antes de crear otra.',
          }),
          { status: 409, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
        )
      }
    }

    const stripe = new Stripe(stripeSecret, {
      httpClient: Stripe.createFetchHttpClient(),
      apiVersion: '2023-10-16',
    })

    const sessionParams: Stripe.Checkout.SessionCreateParams = {
      mode,
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: successUrl,
      cancel_url: cancelUrl,
      allow_promotion_codes: true,
      client_reference_id: user.id,
      metadata: {
        supabase_user_id: user.id,
        plan_tier: planTier,
      },
    }

    if (user.email) {
      sessionParams.customer_email = user.email
    }

    if (mode === 'subscription') {
      sessionParams.subscription_data = {
        metadata: {
          supabase_user_id: user.id,
          plan_tier: planTier,
        },
      }

      const { data: prev } = await supabase
        .from('subscriptions')
        .select('stripe_customer_id')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle()

      if (prev?.stripe_customer_id) {
        sessionParams.customer = prev.stripe_customer_id
        delete sessionParams.customer_email
      }
    }

    const session = await stripe.checkout.sessions.create(sessionParams)

    return new Response(JSON.stringify({ url: session.url }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e)
    console.error(e)
    return new Response(JSON.stringify({ error: msg }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})
