import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { supabase } from '../lib/supabase'

/**
 * Supabase: confirmación por correo / magic link.
 * - implicit: tokens en hash (#access_token=…) — funciona aunque abras el mail en otro navegador.
 * - pkce: ?code=… — requiere el mismo navegador donde te registraste (verifier en localStorage).
 * Redirect en Dashboard: Auth → URL Configuration → `…/auth/callback` (localhost + producción).
 */
export default function AuthCallbackPage() {
  const navigate = useNavigate()
  const [state, setState] = useState(/** @type {'loading' | 'error'} */ ('loading'))
  const [message, setMessage] = useState('')

  useEffect(() => {
    let cancelled = false

    async function run() {
      const search = new URLSearchParams(window.location.search)
      const hash =
        window.location.hash && window.location.hash.length > 1
          ? new URLSearchParams(window.location.hash.slice(1))
          : new URLSearchParams()

      const error = search.get('error') || hash.get('error')
      const errorDescription = search.get('error_description') || hash.get('error_description')
      if (error) {
        const decoded = errorDescription
          ? decodeURIComponent(errorDescription.replace(/\+/g, ' '))
          : error
        if (!cancelled) {
          setState('error')
          setMessage(decoded)
        }
        return
      }

      const code = search.get('code')
      if (code) {
        const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code)
        if (cancelled) return
        if (exchangeError) {
          setState('error')
          const msg = exchangeError.message ?? ''
          if (/PKCE code verifier not found/i.test(msg)) {
            setMessage(
              'Este enlace debe abrirse en el mismo navegador donde te registraste, o la app debe usar el flujo por hash. Si sigue fallando, pide un nuevo correo de verificación e intenta iniciar sesión con tu contraseña.',
            )
          } else if (/expired|invalid/i.test(msg)) {
            setMessage(
              'El enlace expiró o ya se usó. Inicia sesión o pide un nuevo correo de verificación desde la app.',
            )
          } else {
            setMessage(msg || 'No se pudo verificar la sesión.')
          }
          return
        }
        navigate('/dashboard', { replace: true })
        return
      }

      const accessToken = hash.get('access_token')
      const refreshToken = hash.get('refresh_token')
      if (accessToken) {
        const { error: sessionErr } = await supabase.auth.setSession({
          access_token: accessToken,
          refresh_token: refreshToken ?? '',
        })
        if (cancelled) return
        if (sessionErr) {
          setState('error')
          setMessage(sessionErr.message ?? 'Could not restore session.')
          return
        }
        navigate('/dashboard', { replace: true })
        return
      }

      if (!cancelled) {
        setState('error')
        setMessage(
          'Invalid or incomplete link. Try signing in, or request a new confirmation email.',
        )
      }
    }

    run()
    return () => {
      cancelled = true
    }
  }, [navigate])

  if (state === 'loading') {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-[#05070a] text-[#8a9aaa]">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-[#00ff9f]/30 border-t-[#00ff9f]" />
        <p className="mt-4 text-sm">Verifying your email…</p>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#05070a] px-4 text-[#dce3eb]">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass w-full max-w-md rounded-2xl border border-[#2a414f] p-8 text-center"
      >
        <h1 className="text-xl font-semibold text-white">Email verification</h1>
        <p className="mt-3 text-sm text-[#94a3b3]">{message}</p>
        <div className="mt-8 flex flex-col gap-3">
          <Link
            to="/login"
            className="rounded-xl bg-[#00ff9f] py-3 text-center text-sm font-semibold text-[#05120c]"
          >
            Log in
          </Link>
          <Link
            to="/register"
            className="rounded-xl border border-[#2a414f] py-3 text-center text-sm text-[#b8c8d4] hover:border-[#00ff9f]/30"
          >
            Create account
          </Link>
        </div>
      </motion.div>
    </div>
  )
}
