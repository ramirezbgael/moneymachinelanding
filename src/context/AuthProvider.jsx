import { useCallback, useEffect, useMemo, useState } from 'react'
import { supabase } from '../lib/supabase'
import { isEmailConfirmed } from '../lib/authUtils'
import { AuthContext } from './authContext'

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session: s } }) => {
      setSession(s)
      setLoading(false)
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, s) => {
      setSession(s)
    })

    return () => subscription.unsubscribe()
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
