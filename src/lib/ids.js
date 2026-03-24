/** Formato UUID estándar (evita que PostgREST reciba `eq.undefined` u otros valores no UUID). */
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

/**
 * Evita filtros PostgREST inválidos: `.eq('user_id', undefined)` genera `eq.undefined` → HTTP 400.
 * @param {unknown} value
 * @returns {value is string}
 */
export function isValidUserId(value) {
  return typeof value === 'string' && UUID_RE.test(value.trim())
}
