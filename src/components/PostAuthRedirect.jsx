import { useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'
import { isValidUserId } from '../lib/ids'
import { fetchUserBusinessesPreview } from '../lib/supabase'
import { useAuth } from '../hooks/useAuth'

/**
 * Si ya hay sesión: /dashboard si tiene negocio, si no /onboarding.
 */
export function PostAuthRedirect() {
  const { user, loading } = useAuth()
  const [target, setTarget] = useState(null)

  useEffect(() => {
    if (loading || !user) return
    let cancelled = false
    ;(async () => {
      if (!isValidUserId(user.id)) {
        if (!cancelled) setTarget('/login')
        return
      }
      const { data, error } = await fetchUserBusinessesPreview(user.id)
      if (cancelled) return
      if (error) {
        setTarget('/onboarding')
        return
      }
      setTarget(data?.length ? '/dashboard' : '/onboarding')
    })()
    return () => {
      cancelled = true
    }
  }, [user, loading])

  if (loading || !user) return null
  if (target === null) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#05070a]">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-[#00ff9f]/30 border-t-[#00ff9f]" />
      </div>
    )
  }
  return <Navigate to={target} replace />
}
