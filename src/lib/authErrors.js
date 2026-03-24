/**
 * Mensajes seguros para el usuario final (sin filtrar detalles técnicos de la API).
 * @param {import('@supabase/supabase-js').AuthError | Error | null | undefined} error
 * @param {{ lang?: 'es' | 'en' }} [opts]
 */
export function getFriendlyAuthErrorMessage(error, opts = {}) {
  const lang = opts.lang ?? 'en'
  const es = {
    generic: 'No pudimos iniciar sesión. Revisa tu correo y contraseña.',
    invalid: 'Correo o contraseña incorrectos.',
    emailNotConfirmed: 'Confirma tu correo antes de entrar. Revisa tu bandeja o pide un nuevo enlace.',
    tooManyRequests: 'Demasiados intentos. Espera un momento e inténtalo de nuevo.',
    network: 'Problema de conexión. Comprueba tu red e inténtalo de nuevo.',
  }
  const en = {
    generic: 'We could not sign you in. Check your email and password.',
    invalid: 'Wrong email or password.',
    emailNotConfirmed: 'Please confirm your email before signing in. Check your inbox or request a new link.',
    tooManyRequests: 'Too many attempts. Wait a moment and try again.',
    network: 'Connection problem. Check your network and try again.',
  }
  const t = lang === 'es' ? es : en

  if (!error) return t.generic

  const msg = String(error.message ?? '').toLowerCase()
  const code = 'code' in error && error.code ? String(error.code).toLowerCase() : ''

  if (
    code.includes('invalid_credentials') ||
    msg.includes('invalid login credentials') ||
    msg.includes('invalid email or password')
  ) {
    return t.invalid
  }
  if (msg.includes('email not confirmed') || msg.includes('not confirmed')) {
    return t.emailNotConfirmed
  }
  if (msg.includes('too many requests') || code === 'over_request_rate_limit') {
    return t.tooManyRequests
  }
  if (msg.includes('network') || msg.includes('fetch')) {
    return t.network
  }

  return t.generic
}

/**
 * @param {import('@supabase/supabase-js').AuthError | Error | null | undefined} error
 * @param {{ lang?: 'es' | 'en' }} [opts]
 */
export function getFriendlySignUpErrorMessage(error, opts = {}) {
  const lang = opts.lang ?? 'es'
  const es = {
    generic: 'No pudimos crear la cuenta. Revisa los datos e inténtalo de nuevo.',
    exists: 'Ya existe una cuenta con este correo. Inicia sesión o usa otro email.',
    weakPassword: 'La contraseña no cumple los requisitos. Usa al menos 6 caracteres.',
    invalidEmail: 'El correo no es válido.',
    rate: 'Demasiados intentos. Espera un momento e inténtalo de nuevo.',
  }
  const en = {
    generic: 'We could not create your account. Check your details and try again.',
    exists: 'An account with this email already exists. Sign in or use another email.',
    weakPassword: 'Password does not meet requirements. Use at least 6 characters.',
    invalidEmail: 'That email address is not valid.',
    rate: 'Too many attempts. Wait a moment and try again.',
  }
  const t = lang === 'es' ? es : en

  if (!error) return t.generic

  const msg = String(error.message ?? '').toLowerCase()
  const code = 'code' in error && error.code ? String(error.code).toLowerCase() : ''

  if (
    msg.includes('already registered') ||
    msg.includes('already been registered') ||
    msg.includes('user already exists') ||
    code === 'user_already_exists'
  ) {
    return t.exists
  }
  if (msg.includes('password') && (msg.includes('least') || msg.includes('short') || msg.includes('weak'))) {
    return t.weakPassword
  }
  if (msg.includes('invalid email') || msg.includes('email address') || code === 'validation_failed') {
    return t.invalidEmail
  }
  if (msg.includes('too many requests') || code === 'over_request_rate_limit') {
    return t.rate
  }

  return t.generic
}
