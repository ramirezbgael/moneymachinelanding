import { isValidUserId } from './ids'
import { supabase } from './supabase'
import { isProUser as isProPlan, planLabel } from './plan'

export { isProPlan, planLabel }

const PRIMARY_BIZ_KEY = 'mm_primary_business_id'

/** @typedef {{ id: string, user_id: string, name: string, type: string, slug?: string, logo_url?: string | null, theme_color?: string | null, modules_enabled?: Record<string, boolean> | null, created_at?: string }} StoreRow */

/**
 * @param {string} userId
 * @returns {Promise<{ profile: object | null, stores: StoreRow[], activeSubscription: object | null, latestSubscription: object | null, error: Error | null }>}
 */
export async function fetchWorkspaceForUser(userId) {
  if (!isValidUserId(userId)) {
    return { profile: null, stores: [], activeSubscription: null, latestSubscription: null, error: null }
  }

  try {
    const t0 = Date.now()
    const { data: profile, error: pErr } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .maybeSingle()
    if (import.meta.env.DEV) console.log('[workspace] profiles', { ms: Date.now() - t0, ok: !pErr, pErr })
    if (pErr) throw pErr

    const t1 = Date.now()
    const { data: owned, error: oErr } = await supabase
      .from('businesses')
      .select('*')
      .eq('user_id', userId)
    if (import.meta.env.DEV) console.log('[workspace] businesses owned', { ms: Date.now() - t1, n: owned?.length ?? 0, oErr })
    if (oErr) throw oErr

    const t2 = Date.now()
    const { data: memberships, error: mErr } = await supabase
      .from('business_members')
      .select('business_id')
      .eq('user_id', userId)
    if (import.meta.env.DEV) console.log('[workspace] business_members', { ms: Date.now() - t2, n: memberships?.length ?? 0, mErr })
    if (mErr) throw mErr

    const memberIds = [...new Set((memberships ?? []).map((m) => m.business_id).filter(Boolean))]
    let memberStores = []
    if (memberIds.length > 0) {
      const t3 = Date.now()
      const { data: ms, error: msErr } = await supabase.from('businesses').select('*').in('id', memberIds)
      if (import.meta.env.DEV) console.log('[workspace] businesses via membership', { ms: Date.now() - t3, n: ms?.length ?? 0, msErr })
      if (msErr) throw msErr
      memberStores = ms ?? []
    }

    const byId = new Map()
    for (const s of [...(owned ?? []), ...memberStores]) {
      byId.set(s.id, s)
    }
    const stores = [...byId.values()].sort(
      (a, b) => new Date(a.created_at ?? 0).getTime() - new Date(b.created_at ?? 0).getTime(),
    )

    let activeSubscription = null
    const t4 = Date.now()
    const { data: subRow, error: subErr } = await supabase
      .from('subscriptions')
      .select('id, status, stripe_subscription_id, current_period_end')
      .eq('user_id', userId)
      .in('status', ['active', 'trialing'])
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle()
    if (import.meta.env.DEV) console.log('[workspace] subscriptions active', { ms: Date.now() - t4, ok: !subErr, subErr })
    if (!subErr) {
      activeSubscription = subRow
    }

    let latestSubscription = null
    const t5 = Date.now()
    const { data: latestRow, error: latestErr } = await supabase
      .from('subscriptions')
      .select('id, status, stripe_subscription_id, current_period_end, updated_at')
      .eq('user_id', userId)
      .order('updated_at', { ascending: false })
      .limit(1)
      .maybeSingle()
    if (import.meta.env.DEV) console.log('[workspace] subscriptions latest', { ms: Date.now() - t5, ok: !latestErr, latestErr })
    if (!latestErr) {
      latestSubscription = latestRow
    }

    return { profile, stores, activeSubscription, latestSubscription, error: null }
  } catch (e) {
    if (import.meta.env.DEV) console.log('[workspace] fetchWorkspaceForUser failed', e)
    return {
      profile: null,
      stores: [],
      activeSubscription: null,
      latestSubscription: null,
      error: toWorkspaceError(e),
    }
  }
}

/** @param {unknown} e */
function toWorkspaceError(e) {
  if (e instanceof Error) {
    const m = e.message || ''
    // Safari: fetch bloqueado por CORS suele llegar como TypeError "Load failed" sin más detalle.
    if (/^load failed$/i.test(m.trim())) {
      return new Error(
        'Load failed (suele ser CORS o red). Añade el origin exacto de esta app en Supabase → Settings → API → CORS (p. ej. http://localhost:5173).',
      )
    }
    return e
  }
  if (e && typeof e === 'object') {
    const o = /** @type {Record<string, unknown>} */ (e)
    const parts = [o.message, o.details, o.hint, o.code].filter(Boolean)
    const msg = parts.length ? parts.map(String).join(' | ') : JSON.stringify(e)
    return new Error(msg)
  }
  return new Error(String(e))
}

/** @param {StoreRow[]} stores */
export function getStoredPrimaryBusinessId(stores) {
  try {
    const raw = localStorage.getItem(PRIMARY_BIZ_KEY)
    if (!raw || !stores.some((s) => s.id === raw)) return stores[0]?.id ?? null
    return raw
  } catch {
    return stores[0]?.id ?? null
  }
}

/** @param {string | null} id */
export function setStoredPrimaryBusinessId(id) {
  try {
    if (id) localStorage.setItem(PRIMARY_BIZ_KEY, id)
    else localStorage.removeItem(PRIMARY_BIZ_KEY)
  } catch {
    /* ignore */
  }
}

/**
 * @param {string} businessId
 * @returns {Promise<{ members: object[], invites: object[], error: Error | null }>}
 */
export async function fetchTeamForBusiness(businessId) {
  if (!businessId) return { members: [], invites: [], error: null }
  try {
    const { data: members, error: mErr } = await supabase
      .from('business_members')
      .select('id, user_id, role, created_at')
      .eq('business_id', businessId)
    if (mErr) throw mErr

    const userIds = [...new Set((members ?? []).map((x) => x.user_id).filter(Boolean))]
    let profilesById = {}
    if (userIds.length > 0) {
      const { data: profs, error: pErr } = await supabase.from('profiles').select('id, email, name').in('id', userIds)
      if (pErr) throw pErr
      profilesById = Object.fromEntries((profs ?? []).map((p) => [p.id, p]))
    }

    const withProfiles = (members ?? []).map((m) => ({
      ...m,
      profile: profilesById[m.user_id] ?? null,
    }))

    const { data: invites, error: iErr } = await supabase
      .from('business_invites')
      .select('*')
      .eq('business_id', businessId)
      .order('created_at', { ascending: false })
    if (iErr) throw iErr

    return { members: withProfiles, invites: invites ?? [], error: null }
  } catch (e) {
    return { members: [], invites: [], error: e instanceof Error ? e : new Error(String(e)) }
  }
}

/** @param {{ businessId: string, email: string, role: string, invitedBy: string }} p */
export async function createBusinessInvite({ businessId, email, role, invitedBy }) {
  const baseUrl = import.meta.env.VITE_SUPABASE_URL
  const anon = import.meta.env.VITE_SUPABASE_ANON_KEY
  if (!baseUrl || !anon) {
    return { error: { message: 'Faltan VITE_SUPABASE_URL o VITE_SUPABASE_ANON_KEY.' } }
  }

  const {
    data: { session },
  } = await supabase.auth.getSession()
  if (!session?.access_token) {
    return { error: { message: 'Sesión inválida. Inicia sesión de nuevo.' } }
  }

  const url = `${baseUrl.replace(/\/$/, '')}/functions/v1/send-business-invite`
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${session.access_token}`,
        apikey: anon,
      },
      body: JSON.stringify({
        businessId,
        email: email.trim().toLowerCase(),
        role,
        invitedBy,
      }),
    })
    const data = await res.json().catch(() => ({}))
    if (!res.ok) {
      return {
        error: {
          message: data.message || data.error || `Error ${res.status} al enviar invitación`,
        },
      }
    }
    return { error: null }
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e)
    return { error: { message: `No se pudo enviar la invitación: ${msg}` } }
  }
}

/** @param {string} inviteId */
export async function deleteBusinessInvite(inviteId) {
  return supabase.from('business_invites').delete().eq('id', inviteId)
}

const POS_BY_TYPE = {
  retail: 'https://retail.moneymachine.com.mx',
  restaurant: 'https://food.moneymachine.com.mx',
  gym: 'https://gym.moneymachine.com.mx',
}

/** @param {string | null | undefined} rawType */
export function normalizeBusinessType(rawType) {
  const value = String(rawType ?? '').trim().toLowerCase()
  if (value === 'restaurant') return 'restaurant'
  if (value === 'gym') return 'gym'
  if (value === 'store' || value === 'retail' || value === 'services' || value === 'other') return 'retail'
  return 'retail'
}

/** @param {string | null | undefined} rawType */
export function getBusinessTypeLabel(rawType) {
  const type = normalizeBusinessType(rawType)
  if (type === 'restaurant') return 'Restaurante'
  if (type === 'gym') return 'Gimnasio'
  return 'Commerce'
}

/** @param {string | null | undefined} rawType */
export function getPosBaseUrlByBusinessType(rawType) {
  const type = normalizeBusinessType(rawType)
  return POS_BY_TYPE[type] ?? POS_BY_TYPE.retail
}

/**
 * URL de POS centralizada por tipo de negocio.
 * @param {{ id?: string | null, type?: string | null } | null | undefined} business
 */
export function getPosUrlForBusiness(business) {
  const base = getPosBaseUrlByBusinessType(business?.type)
  if (!business?.id) return base
  return `${base}?business_id=${encodeURIComponent(business.id)}`
}

const DEFAULT_MODULES = { inventory: false, reports: false, multi_store: false }

/** @param {unknown} raw */
export function normalizeModulesEnabled(raw) {
  if (!raw || typeof raw !== 'object') return { ...DEFAULT_MODULES }
  const o = /** @type {Record<string, unknown>} */ (raw)
  return {
    inventory: Boolean(o.inventory),
    reports: Boolean(o.reports),
    multi_store: Boolean(o.multi_store),
  }
}
