/**
 * Mensajes solo para el usuario final (sin SQL, códigos Postgres ni rutas de archivos).
 * Los detalles técnicos van a consola en desarrollo desde la página que llama.
 */

const MSG_SESSION =
  'Tu sesión no es válida o expiró. Cierra sesión, vuelve a entrar e inténtalo de nuevo.'

const MSG_SERVER =
  'No pudimos guardar tu negocio ahora. Espera unos minutos e inténtalo otra vez. Si sigue igual, contacta a soporte.'

const MSG_NETWORK = 'No hay conexión. Revisa tu red e inténtalo de nuevo.'

const MSG_NAME = 'Indica un nombre para tu negocio.'

const MSG_DEFAULT =
  'Algo salió mal al registrar tu negocio. Inténtalo de nuevo en un momento.'

/**
 * @param {unknown} err
 */
export function getOnboardingErrorMessage(err) {
  const raw = err && typeof err === 'object' && 'message' in err ? String(err.message) : ''
  const code =
    err && typeof err === 'object' && 'code' in err && err.code != null
      ? String(err.code)
      : ''
  const details =
    err && typeof err === 'object' && 'details' in err && err.details != null
      ? String(err.details).toLowerCase()
      : ''
  const combined = `${raw} ${details}`.toLowerCase()

  if (
    combined.includes('not authenticated') ||
    combined.includes('jwt') ||
    combined.includes('invalid claim')
  ) {
    return MSG_SESSION
  }

  if (combined.includes('network') || combined.includes('fetch') || combined.includes('failed to fetch')) {
    return MSG_NETWORK
  }

  if (combined.includes('business name required')) {
    return MSG_NAME
  }

  // Cualquier error de servidor / esquema / RLS / columna / RPC: mismo mensaje neutro
  if (
    code === '42501' ||
    String(code) === '42703' ||
    code === '23502' ||
    code === '42883' ||
    code === 'PGRST202' ||
    combined.includes('permission denied') ||
    combined.includes('row-level security') ||
    combined.includes('does not exist') ||
    combined.includes('could not find the function')
  ) {
    return MSG_SERVER
  }

  return MSG_DEFAULT
}
