import { useCallback, useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { isProUser, planLabel } from '../lib/plan'
import { useAuth } from './useAuth'
import { isValidUserId } from '../lib/ids'

/**
 * Perfil + suscripciones Stripe (tabla public.subscriptions) tras login.
 * Útil fuera del layout del dashboard; dentro del dashboard puedes usar useDashboardWorkspace + refresh.
 */
export function usePlan() {
  const { user, loading: authLoading } = useAuth()
  const [profile, setProfile] = useState(null)
  const [activeSubscription, setActiveSubscription] = useState(null)
  const [loading, setLoading] = useState(true)

  const refresh = useCallback(async () => {
    if (!user?.id || !isValidUserId(user.id)) {
      setProfile(null)
      setActiveSubscription(null)
      setLoading(false)
      return
    }
    setLoading(true)
    try {
      const [profRes, subRes] = await Promise.all([
        supabase.from('profiles').select('*').eq('id', user.id).maybeSingle(),
        supabase
          .from('subscriptions')
          .select('id, status, stripe_subscription_id, current_period_end, price_id')
          .eq('user_id', user.id)
          .in('status', ['active', 'trialing'])
          .order('created_at', { ascending: false })
          .limit(1)
          .maybeSingle(),
      ])
      if (profRes.error) throw profRes.error
      setProfile(profRes.data)
      if (subRes.error) {
        if (import.meta.env.DEV && subRes.error.code !== '42P01') {
          console.warn('[usePlan] subscriptions:', subRes.error.message)
        }
        setActiveSubscription(null)
      } else {
        setActiveSubscription(subRes.data ?? null)
      }
    } catch (e) {
      if (import.meta.env.DEV) console.error('[usePlan]', e)
      setProfile(null)
      setActiveSubscription(null)
    } finally {
      setLoading(false)
    }
  }, [user?.id])

  useEffect(() => {
    if (authLoading) return
    refresh()
  }, [authLoading, refresh])

  const proFromProfile = isProUser(profile)
  const proFromSub = Boolean(activeSubscription)
  const isPro = proFromProfile || proFromSub
  const hasActiveStripeSubscription = proFromSub

  return {
    profile,
    plan: profile?.plan ?? 'free',
    isPro,
    hasActiveStripeSubscription,
    planLabel: planLabel(profile),
    activeSubscription,
    loading: authLoading || loading,
    refresh,
  }
}
