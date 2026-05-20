import { createClient } from '@supabase/supabase-js'
import { isValidUserId } from './ids'

const url = (import.meta.env.VITE_SUPABASE_URL ?? '').trim()
const anonKey = (import.meta.env.VITE_SUPABASE_ANON_KEY ?? '').trim()
const supabaseConfigured =
  Boolean(url && anonKey && /^https?:\/\/.+/i.test(url))

if (!supabaseConfigured) {
  const msg =
    '[MoneyMachine] Build sin Supabase: define VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY en .env antes de npm run build (ver DEPLOY_IONOS.md).'
  if (import.meta.env.DEV) console.warn(msg)
  else console.error(msg)
}

/** false si el deploy se hizo sin .env (típico en Netlify sin variables). */
export { supabaseConfigured }

export const supabase = createClient(
  supabaseConfigured ? url : 'https://invalid.local',
  supabaseConfigured ? anonKey : 'invalid',
  {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    // implicit: el enlace del correo trae tokens en el hash (#access_token=…).
    // pkce guarda un "code verifier" en localStorage al registrarte; si abres el mail
    // en otro navegador, app de correo o dispositivo, no existe y falla con
    // "PKCE code verifier not found in storage".
    flowType: 'implicit',
    debug: false,
  },
  },
)

function slugBaseFromName(name) {
  const normalized = String(name ?? '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
  const base = normalized || 'negocio'
  return base.slice(0, 60)
}

function randomSlugSuffix(size = 10) {
  const token = Math.random().toString(36).slice(2)
  return token.slice(0, size).padEnd(size, 'x')
}

function shouldFallbackToDirectInsert(error) {
  if (!error) return false
  const code = String(error.code ?? '')
  const status = Number(error.status ?? 0)
  const msg = `${error.message ?? ''} ${error.details ?? ''}`.toLowerCase()
  return (
    status === 404 ||
    code === 'PGRST202' ||
    msg.includes('could not find the function') ||
    msg.includes('schema cache') ||
    msg.includes('404')
  )
}

async function createBusinessAndMembershipFallback(businessName, businessType) {
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()
  if (authError) return { businessId: null, error: authError }
  if (!user?.id) return { businessId: null, error: new Error('Not authenticated') }

  const base = slugBaseFromName(businessName)
  let businessId = null
  let lastInsertError = null

  for (let attempt = 0; attempt < 8; attempt += 1) {
    const slug = `${base}-${randomSlugSuffix(10)}`
    const { data: createdBusiness, error: businessError } = await supabase
      .from('businesses')
      .insert({
        user_id: user.id,
        name: businessName,
        type: businessType || 'store',
        slug,
      })
      .select('id')
      .single()

    if (businessError) {
      lastInsertError = businessError
      // Colisión de slug único, reintentar con otro sufijo.
      const isUniqueViolation = String(businessError.code ?? '') === '23505'
      if (isUniqueViolation) continue
      return { businessId: null, error: businessError }
    }

    businessId = createdBusiness?.id ?? null
    if (businessId) break
  }

  if (!businessId) {
    return { businessId: null, error: lastInsertError ?? new Error('Could not create business') }
  }

  const { error: memberError } = await supabase.from('business_members').insert({
    business_id: businessId,
    user_id: user.id,
    role: 'owner',
  })
  if (memberError) return { businessId: null, error: memberError }

  return { businessId, error: null }
}

/** URL absoluta para enlaces de confirmación (configura la misma en Supabase → Auth → Redirect URLs). */
export function getAuthCallbackUrl() {
  if (typeof window === 'undefined') return ''
  return `${window.location.origin}/auth/callback`
}

/** Enlace en el correo de “restablecer contraseña” (añade la URL en Supabase → Auth → Redirect URLs). */
export function getPasswordRecoveryUrl() {
  if (typeof window === 'undefined') return ''
  return `${window.location.origin}/auth/reset-password`
}

/** @param {number} days */
export function trialEndsAtIso(days = 7) {
  return new Date(Date.now() + days * 24 * 60 * 60 * 1000).toISOString()
}

/**
 * Asegura fila en profiles (tras signUp o si el trigger aún no corrió).
 * Reintenta con menos columnas si PostgREST devuelve PGRST204 (columna ausente / caché vieja).
 * @param {{ id: string, email?: string | null }} user
 * @param {string | null | undefined} name
 */
export async function upsertProfileAfterSignup(user, name) {
  const base = {
    id: user.id,
    plan: 'free',
    trial_ends_at: trialEndsAtIso(7),
    created_at: new Date().toISOString(),
  }
  const full = {
    ...base,
    email: user.email ?? null,
    name: name?.trim() || null,
    billing_status: 'trial',
  }
  const withoutBilling = {
    ...base,
    email: user.email ?? null,
    name: name?.trim() || null,
  }
  const withoutEmail = {
    ...base,
    name: name?.trim() || null,
  }
  const minimal = { ...base }

  const attempts = [full, withoutBilling, withoutEmail, minimal]
  let lastError = null

  for (const payload of attempts) {
    const { error } = await supabase.from('profiles').upsert(payload, {
      onConflict: 'id',
    })
    if (!error) return { error: null }
    lastError = error
    const msg = error.message ?? ''
    const isSchema =
      error.code === 'PGRST204' ||
      msg.includes('schema cache') ||
      msg.includes('Could not find the')
    if (!isSchema) return { error }
  }

  return { error: lastError }
}

/**
 * Lista negocios del usuario (máx. 1 fila para comprobar existencia).
 * No llama a la API si `userId` no es un UUID válido (evita 400 por `eq.undefined`).
 * @param {string} userId
 */
export async function fetchUserBusinessesPreview(userId) {
  if (!isValidUserId(userId)) {
    return { data: [], error: null }
  }
  // Misma lógica que fetchWorkspaceForUser: solo “hay negocio” si existe fila en `businesses`
  // que el usuario puede leer (dueño o miembro). Si solo hay `business_members` huérfano,
  // no devolver filas — evita el bucle /dashboard ↔ /onboarding.

  const t0 = Date.now()
  const owned = await supabase.from('businesses').select('id').eq('user_id', userId).limit(1)
  if (import.meta.env.DEV)
    console.log('[bizPreview] businesses owned', { ms: Date.now() - t0, n: owned.data?.length ?? 0, error: owned.error })
  if (owned.error) return owned
  if ((owned.data?.length ?? 0) > 0) return owned

  const t1 = Date.now()
  const mem = await supabase
    .from('business_members')
    .select('business_id')
    .eq('user_id', userId)
  if (import.meta.env.DEV)
    console.log('[bizPreview] business_members', { ms: Date.now() - t1, n: mem.data?.length ?? 0, error: mem.error })
  if (mem.error) return { data: [], error: mem.error }

  const memberIds = [...new Set((mem.data ?? []).map((m) => m.business_id).filter(Boolean))]
  if (memberIds.length === 0) return { data: [], error: null }

  const t2 = Date.now()
  const viaMembership = await supabase.from('businesses').select('id').in('id', memberIds).limit(1)
  if (import.meta.env.DEV)
    console.log('[bizPreview] businesses via membership', {
      ms: Date.now() - t2,
      n: viaMembership.data?.length ?? 0,
      error: viaMembership.error,
    })
  if (viaMembership.error) return viaMembership
  return viaMembership
}

/** @param {string} userId */
export async function userHasBusiness(userId) {
  if (!isValidUserId(userId)) return false
  const { data, error } = await fetchUserBusinessesPreview(userId)
  if (error) return false
  return (data?.length ?? 0) > 0
}

/**
 * Crea negocio + membresía owner (RPC en Supabase).
 * @param {string} businessName
 * @param {string} businessType
 */
export async function createBusinessAndMembership(businessName, businessType) {
  if (import.meta.env.DEV)
    console.log('[onboarding] rpc create_business_and_membership', { businessName, businessType })
  const { data, error } = await supabase.rpc('create_business_and_membership', {
    p_name: businessName,
    p_type: businessType || 'store',
  })
  if (error && shouldFallbackToDirectInsert(error)) {
    if (import.meta.env.DEV) {
      console.warn('[onboarding] rpc unavailable, using fallback insert', error)
    }
    return createBusinessAndMembershipFallback(businessName, businessType)
  }
  if (import.meta.env.DEV)
    console.log('[onboarding] rpc result', { businessId: data, ok: !error, error })
  return { businessId: data, error }
}
