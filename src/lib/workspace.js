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
    const { data: profile, error: pErr } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .maybeSingle()
    if (pErr) throw pErr

    const { data: owned, error: oErr } = await supabase
      .from('businesses')
      .select('*')
      .eq('user_id', userId)
    if (oErr) throw oErr

    const { data: memberships, error: mErr } = await supabase
      .from('business_members')
      .select('business_id')
      .eq('user_id', userId)
    if (mErr) throw mErr

    const memberIds = [...new Set((memberships ?? []).map((m) => m.business_id).filter(Boolean))]
    let memberStores = []
    if (memberIds.length > 0) {
      const { data: ms, error: msErr } = await supabase.from('businesses').select('*').in('id', memberIds)
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
    const { data: subRow, error: subErr } = await supabase
      .from('subscriptions')
      .select('id, status, stripe_subscription_id, current_period_end')
      .eq('user_id', userId)
      .in('status', ['active', 'trialing'])
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle()
    if (!subErr) {
      activeSubscription = subRow
    }

    let latestSubscription = null
    const { data: latestRow, error: latestErr } = await supabase
      .from('subscriptions')
      .select('id, status, stripe_subscription_id, current_period_end, updated_at')
      .eq('user_id', userId)
      .order('updated_at', { ascending: false })
      .limit(1)
      .maybeSingle()
    if (!latestErr) {
      latestSubscription = latestRow
    }

    return { profile, stores, activeSubscription, latestSubscription, error: null }
  } catch (e) {
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
  if (e instanceof Error) return e
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
  return supabase.from('business_invites').insert({
    business_id: businessId,
    email: email.trim().toLowerCase(),
    role,
    invited_by: invitedBy,
  })
}

/** @param {string} inviteId */
export async function deleteBusinessInvite(inviteId) {
  return supabase.from('business_invites').delete().eq('id', inviteId)
}

const POS_BASE = 'https://moneymachinepos.netlify.app'

/** @param {string} storeId */
export function getPosUrl(storeId) {
  return `${POS_BASE}/${storeId}`
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
