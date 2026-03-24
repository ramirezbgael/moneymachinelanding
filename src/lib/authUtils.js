/**
 * Email verification (Supabase Auth).
 * Source of truth: `user.email_confirmed_at` (timestamp when confirmed).
 * Optional mirror in JWT: `user.user_metadata.email_confirmed` (sync if you use a trigger/hook).
 *
 * @param {import('@supabase/supabase-js').User | null | undefined} user
 */
export function isEmailConfirmed(user) {
  if (!user) return false
  if (user.email_confirmed_at) return true
  if (user.user_metadata?.email_confirmed === true) return true
  return false
}

/**
 * @param {import('@supabase/supabase-js').User | null | undefined} user
 */
export function getAuthEmail(user) {
  return user?.email?.trim() ?? ''
}
