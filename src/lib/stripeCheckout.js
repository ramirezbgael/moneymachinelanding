import { supabase } from './supabase'

/**
 * Price IDs de Stripe (no uses prod_..., usa price_... de cada precio en el dashboard).
 * Productos de referencia:
 * - pro mensual: prod_UCFGRksv2lpXnE
 * - pro anual: prod_UCFW07IF5aDJhD
 * - business mensual: prod_UCFUKsdfcYzPWA
 * - business anual: prod_UCFZOIVdTog3o7
 */
export function getStripePriceId(tier, interval) {
  const env = import.meta.env
  if (tier === 'pro') {
    return interval === 'year'
      ? env.VITE_STRIPE_PRICE_PRO_YEARLY
      : env.VITE_STRIPE_PRICE_PRO_MONTHLY
  }
  if (tier === 'business') {
    return interval === 'year'
      ? env.VITE_STRIPE_PRICE_BUSINESS_YEARLY
      : env.VITE_STRIPE_PRICE_BUSINESS_MONTHLY
  }
  if (tier === 'basic') {
    return env.VITE_STRIPE_PRICE_BASIC_ONETIME
  }
  return ''
}

/**
 * @param {{ priceId: string, mode?: 'subscription' | 'payment', cancelUrl?: string, planTier?: 'pro' | 'business' }} opts
 */
export async function startStripeCheckout({
  priceId,
  mode = 'subscription',
  cancelUrl: cancelUrlOpt,
  planTier = 'pro',
}) {
  if (!priceId || !String(priceId).startsWith('price_')) {
    return {
      ok: false,
      error: 'missing_price',
      message:
        'Falta el Price ID en .env (VITE_STRIPE_PRICE_*). En Stripe abre cada producto y copia el ID que empieza con price_.',
    }
  }

  const baseUrl = import.meta.env.VITE_SUPABASE_URL
  const anon = import.meta.env.VITE_SUPABASE_ANON_KEY
  if (!baseUrl || !anon) {
    return { ok: false, error: 'missing_supabase', message: 'Faltan VITE_SUPABASE_URL o VITE_SUPABASE_ANON_KEY.' }
  }

  const { data: { session } } = await supabase.auth.getSession()

  const cancelUrl =
    cancelUrlOpt ?? `${typeof window !== 'undefined' ? window.location.origin : ''}/pricing`

  const origin = typeof window !== 'undefined' ? window.location.origin : ''
  const url = `${baseUrl.replace(/\/$/, '')}/functions/v1/create-checkout-session`

  const MSG_NO_FUNCTION =
    'La Edge Function «create-checkout-session» no está desplegada en tu proyecto Supabase (el navegador recibe 404 en el preflight CORS). Despliega con: supabase link && supabase secrets set STRIPE_SECRET_KEY=sk_test_xxx && supabase functions deploy create-checkout-session --no-verify-jwt. Más detalle en README (Stripe).'

  let res
  try {
    res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${session?.access_token ?? anon}`,
        apikey: anon,
      },
      body: JSON.stringify({
        priceId,
        mode,
        planTier: planTier === 'business' ? 'business' : 'pro',
        successUrl: `${origin}/dashboard?checkout=success`,
        cancelUrl,
      }),
    })
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e)
    const isNetwork =
      msg.includes('Load failed') ||
      msg.includes('Failed to fetch') ||
      msg.includes('NetworkError')
    return {
      ok: false,
      error: 'fetch_failed',
      message: isNetwork
        ? MSG_NO_FUNCTION
        : `No se pudo llamar a la función de checkout: ${msg}`,
    }
  }

  const data = await res.json().catch(() => ({}))

  if (res.status === 404) {
    return { ok: false, error: 'not_found', message: MSG_NO_FUNCTION }
  }

  if (res.status === 401) {
    return {
      ok: false,
      error: 'unauthorized',
      message:
        data.error ||
        'Sesión no válida. Inicia sesión de nuevo. La función de checkout requiere JWT de usuario (y la función desplegada en Supabase).',
    }
  }

  if (res.status === 409) {
    return {
      ok: false,
      error: 'already_subscribed',
      message:
        data.message ||
        data.error ||
        'Ya tienes una suscripción activa.',
    }
  }

  if (!res.ok) {
    return {
      ok: false,
      error: 'edge_function',
      message:
        data.message ||
        data.error ||
        `Error ${res.status} al crear la sesión de pago. Revisa logs de la función en Supabase (STRIPE_SECRET_KEY, STRIPE_WEBHOOK_SECRET, deploy).`,
    }
  }
  if (data.url) {
    window.location.href = data.url
    return { ok: true }
  }
  return { ok: false, error: 'no_url', message: 'No se recibió URL de Stripe.' }
}

/**
 * Abre el Customer Portal de Stripe (gestionar método de pago, cancelar, facturas).
 * Requiere Edge Function «create-billing-portal-session» desplegada.
 */
export async function openStripeBillingPortal() {
  const baseUrl = import.meta.env.VITE_SUPABASE_URL
  const anon = import.meta.env.VITE_SUPABASE_ANON_KEY
  if (!baseUrl || !anon) {
    return { ok: false, message: 'Faltan VITE_SUPABASE_URL o VITE_SUPABASE_ANON_KEY.' }
  }

  const { data: { session } } = await supabase.auth.getSession()
  const origin = typeof window !== 'undefined' ? window.location.origin : ''
  const url = `${baseUrl.replace(/\/$/, '')}/functions/v1/create-billing-portal-session`

  let res
  try {
    res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${session?.access_token ?? anon}`,
        apikey: anon,
      },
      body: JSON.stringify({ returnUrl: origin }),
    })
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e)
    return { ok: false, message: `No se pudo abrir el portal: ${msg}` }
  }

  const data = await res.json().catch(() => ({}))

  if (res.status === 404) {
    return {
      ok: false,
      message:
        'La función «create-billing-portal-session» no está desplegada. Ejecuta: supabase functions deploy create-billing-portal-session --no-verify-jwt',
    }
  }

  if (!res.ok) {
    return {
      ok: false,
      message: data.message || data.error || `Error ${res.status} al crear el portal.`,
    }
  }

  if (data.url) {
    window.location.href = data.url
    return { ok: true }
  }
  return { ok: false, message: 'No se recibió URL del portal.' }
}

/**
 * Lee Stripe con tu sesión y actualiza `subscriptions` + `profiles` (por si el webhook no corrió).
 * Requiere Edge Function «sync-stripe-subscription» desplegada y STRIPE_SECRET_KEY en secrets.
 * @returns {Promise<{ ok: boolean, message?: string, status?: string }>}
 */
const MSG_SYNC_NOT_DEPLOYED =
  'La Edge Function «sync-stripe-subscription» no existe en tu proyecto Supabase (404 en CORS/preflight). Despliégala desde la carpeta del repo: supabase link --project-ref TU_REF && supabase functions deploy sync-stripe-subscription --no-verify-jwt (necesitas STRIPE_SECRET_KEY=sk_live_… en secrets).'

export async function syncStripeSubscriptionFromServer() {
  const baseUrl = import.meta.env.VITE_SUPABASE_URL
  const anon = import.meta.env.VITE_SUPABASE_ANON_KEY
  if (!baseUrl || !anon) {
    return { ok: false, message: 'Faltan VITE_SUPABASE_URL o VITE_SUPABASE_ANON_KEY.' }
  }

  const { data: { session } } = await supabase.auth.getSession()
  if (!session?.access_token) {
    return { ok: false, message: 'Inicia sesión de nuevo para sincronizar.' }
  }

  const url = `${baseUrl.replace(/\/$/, '')}/functions/v1/sync-stripe-subscription`

  let res
  try {
    res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${session.access_token}`,
        apikey: anon,
      },
      body: JSON.stringify({}),
    })
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e)
    const isNetwork =
      msg.includes('Load failed') ||
      msg.includes('Failed to fetch') ||
      msg.includes('NetworkError')
    return {
      ok: false,
      message: isNetwork ? MSG_SYNC_NOT_DEPLOYED : `No se pudo llamar a la función: ${msg}`,
    }
  }

  const data = await res.json().catch(() => ({}))

  if (res.status === 404) {
    return { ok: false, message: MSG_SYNC_NOT_DEPLOYED }
  }

  if (data.ok !== true) {
    return {
      ok: false,
      message: data.message || data.error || `Error ${res.status}`,
    }
  }

  return { ok: true, status: data.status }
}
