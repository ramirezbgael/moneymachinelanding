/* eslint-disable react-refresh/only-export-components -- hooks exportados junto al provider */
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { isValidUserId } from '../lib/ids'
import { upsertProfileAfterSignup } from '../lib/supabase'
import { isProUser, planLabel } from '../lib/plan'
import {
  fetchWorkspaceForUser,
  getStoredPrimaryBusinessId,
  setStoredPrimaryBusinessId,
} from '../lib/workspace'
import { useAuth } from '../hooks/useAuth'

/** @type {import('react').Context<null | object>} */
const DashboardWorkspaceContext = createContext(null)

export function DashboardWorkspaceProvider({ children }) {
  const { user } = useAuth()
  const [profile, setProfile] = useState(null)
  const [stores, setStores] = useState([])
  const [primaryBusinessId, setPrimaryBusinessIdState] = useState(null)
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState('')
  const [activeSubscription, setActiveSubscription] = useState(null)
  const [latestSubscription, setLatestSubscription] = useState(null)

  const refresh = useCallback(async () => {
    if (!user?.id || !isValidUserId(user.id)) {
      setProfile(null)
      setStores([])
      setActiveSubscription(null)
      setLatestSubscription(null)
      setPrimaryBusinessIdState(null)
      setLoading(false)
      return
    }
    setLoadError('')
    setLoading(true)
    try {
      let {
        profile: prof,
        stores: list,
        activeSubscription: sub,
        latestSubscription: latestSub,
        error,
      } = await fetchWorkspaceForUser(user.id)
      if (error) throw error

      if (!prof) {
        const { error: upErr } = await upsertProfileAfterSignup(user, user.user_metadata?.full_name)
        if (upErr) throw upErr
        const again = await fetchWorkspaceForUser(user.id)
        prof = again.profile
        list = again.stores
        sub = again.activeSubscription
        latestSub = again.latestSubscription
        if (again.error) throw again.error
      }

      setProfile(prof)
      setStores(list)
      setActiveSubscription(sub)
      setLatestSubscription(latestSub ?? null)
      const nextPrimary = getStoredPrimaryBusinessId(list)
      setPrimaryBusinessIdState(nextPrimary)
      if (nextPrimary) setStoredPrimaryBusinessId(nextPrimary)
    } catch (e) {
      if (import.meta.env.DEV) {
        const err = /** @type {{ message?: string, details?: string, code?: string }} */ (e)
        console.error('[workspace]', err?.message ?? e, err?.details, err?.code)
      }
      setLoadError(
        'No se pudieron cargar los datos. Intenta de nuevo más tarde o contacta soporte.',
      )
      setProfile(null)
      setStores([])
      setActiveSubscription(null)
      setLatestSubscription(null)
    } finally {
      setLoading(false)
    }
  }, [user])

  useEffect(() => {
    refresh()
  }, [refresh])

  const setPrimaryBusinessId = useCallback((id) => {
    setPrimaryBusinessIdState(id)
    setStoredPrimaryBusinessId(id)
  }, [])

  const primaryBusiness = useMemo(
    () => stores.find((s) => s.id === primaryBusinessId) ?? stores[0] ?? null,
    [stores, primaryBusinessId],
  )

  const isPro = isProUser(profile) || Boolean(activeSubscription)
  const trialExpired =
    Boolean(profile?.trial_ends_at) && new Date(profile.trial_ends_at).getTime() < Date.now()
  const showPaywall = trialExpired && profile?.billing_status !== 'active'

  const value = useMemo(
    () => ({
      user,
      profile,
      stores,
      primaryBusiness,
      primaryBusinessId: primaryBusiness?.id ?? null,
      setPrimaryBusinessId,
      refresh,
      loading,
      loadError,
      isPro,
      planLabel: planLabel(profile),
      activeSubscription,
      latestSubscription,
      trialExpired,
      showPaywall,
    }),
    [
      user,
      profile,
      stores,
      primaryBusiness,
      setPrimaryBusinessId,
      refresh,
      loading,
      loadError,
      isPro,
      activeSubscription,
      latestSubscription,
      trialExpired,
      showPaywall,
    ],
  )

  return (
    <DashboardWorkspaceContext.Provider value={value}>{children}</DashboardWorkspaceContext.Provider>
  )
}

export function useDashboardWorkspace() {
  const ctx = useContext(DashboardWorkspaceContext)
  if (!ctx) throw new Error('useDashboardWorkspace must be used within DashboardWorkspaceProvider')
  return ctx
}

/** Redirige a onboarding si no hay tiendas (tras cargar). */
export function useRequireStores() {
  const { stores, loading, loadError } = useDashboardWorkspace()
  const navigate = useNavigate()

  useEffect(() => {
    if (loading || loadError) return
    if (stores.length === 0) {
      navigate('/onboarding', { replace: true })
    }
  }, [loading, loadError, stores.length, navigate])
}
