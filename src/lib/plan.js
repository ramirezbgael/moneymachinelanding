/**
 * Plan de facturación en public.profiles (Supabase no usa auth.users.plan).
 * isProUser === true → acceso a funciones Pro.
 */

/**
 * @param {object | null | undefined} profile Fila profiles o null
 * @returns {boolean}
 */
export function isProUser(profile) {
  if (!profile) return false
  const plan = String(profile.plan ?? 'free').toLowerCase()
  if (plan === 'pro' || plan === 'business') return true
  if (String(profile.billing_status ?? '').toLowerCase() === 'active') return true
  return false
}

/** @deprecated usar isProUser */
export function isProPlan(profile) {
  return isProUser(profile)
}

/**
 * @param {object | null | undefined} profile
 */
export function planLabel(profile) {
  if (!profile) return '—'
  if (isProUser(profile)) {
    const p = String(profile.plan ?? 'pro').toLowerCase()
    if (p === 'business') return 'Business'
    return 'Pro'
  }
  const billing = String(profile.billing_status ?? '').toLowerCase()
  if (billing === 'trial') return 'Prueba'
  const pl = String(profile.plan ?? 'free').toLowerCase()
  if (pl === 'trial') return 'Prueba'
  return 'Gratis'
}
