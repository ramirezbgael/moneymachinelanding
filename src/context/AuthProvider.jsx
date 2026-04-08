import { useCallback, useEffect, useMemo, useState } from 'react'
import { supabase } from '../lib/supabase'
import { isEmailConfirmed } from '../lib/authUtils'
import { AuthContext } from './authContext'

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    let t = null
    const timeout = new Promise((resolve) => {
      t = setTimeout(() => resolve({ timeout: true }), 8000)
    })

    Promise.race([supabase.auth.getSession(), timeout]).then(async (result) => {
      if (cancelled) return
      if (result?.timeout) {
        if (import.meta.env.DEV) console.error('[auth] Timeout obteniendo sesión (getSession)')
        setSession(null)
        setLoading(false)
        return
      }

      const {
        data: { session: s },
        error,
      } = result
      if (error) {
        const msg = error.message ?? ''
        // Si hay un refresh token inválido/ausente en storage, Supabase entra en bucle
        // intentando refrescar. Forzamos limpieza para desbloquear la app.
        if (/invalid refresh token|refresh token not found/i.test(msg)) {
          await supabase.auth.signOut()
          setSession(null)
          setLoading(false)
          return
        }
      }
      setSession(s)
      setLoading(false)
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, s) => {
      setSession(s)
    })

    return () => {
      cancelled = true
      if (t) clearTimeout(t)
      subscription.unsubscribe()
    }
  }, [])

  const user = session?.user ?? null
  const emailConfirmed = isEmailConfirmed(user)

  const refreshSession = useCallback(async () => {
    const { data } = await supabase.auth.getSession()
    setSession(data.session)
    return data.session
  }, [])

  const value = useMemo(
    () => ({
      session,
      user,
      emailConfirmed,
      loading,
      signOut: () => supabase.auth.signOut(),
      refreshSession,
    }),
    [session, user, emailConfirmed, loading, refreshSession],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
