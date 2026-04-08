import { createClient } from '@supabase/supabase-js'
import { isValidUserId } from './ids'

const url = import.meta.env.VITE_SUPABASE_URL
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (import.meta.env.DEV && (!url || !anonKey)) {
  console.warn(
    '[MoneyMachine] Faltan VITE_SUPABASE_URL o VITE_SUPABASE_ANON_KEY. Configura .env para auth y datos.',
  )
}

export const supabase = createClient(url ?? '', anonKey ?? '', {
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
})

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
  // 1) Dueño
  const owned = await supabase.from('businesses').select('id').eq('user_id', userId).limit(1)
  if (owned.error) return owned
  if ((owned.data?.length ?? 0) > 0) return owned

  // 2) Miembro (fallback). Esto evita mandar a onboarding a usuarios que ya
  // pertenecen a un negocio pero no son dueños.
  const mem = await supabase
    .from('business_members')
    .select('business_id')
    .eq('user_id', userId)
    .limit(1)
  if (mem.error) return { data: [], error: mem.error }
  if ((mem.data?.length ?? 0) > 0) return { data: [{ id: mem.data[0].business_id }], error: null }

  return { data: [], error: null }
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
  const { data, error } = await supabase.rpc('create_business_and_membership', {
    p_name: businessName,
    p_type: businessType || 'store',
  })
  return { businessId: data, error }
}
