import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { supabase } from '../lib/supabase'
import { STRINGS, useLocale } from '../i18n'
import { AuthPageShell } from '../components/auth/AuthPageShell'

const inputClass =
  'mt-2 w-full rounded-xl border border-[#2a3f4d] bg-[#0a1016] px-4 py-3.5 text-base text-white outline-none transition-[border-color,box-shadow] focus:border-[#00ff9f]/45 focus:ring-2 focus:ring-[#00ff9f]/15'

/**
 * Tras abrir el enlace del correo de recuperación (PKCE ?code=... o hash con tokens).
 * Añade /auth/reset-password en Supabase → Auth → Redirect URLs.
 */
export default function ResetPasswordPage() {
  const { lang, t } = useLocale()
  const navigate = useNavigate()
  const [phase, setPhase] = useState(/** @type {'loading' | 'form' | 'error'} */ ('loading'))
  const [message, setMessage] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [formError, setFormError] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    let cancelled = false

    async function establishSession() {
      const search = new URLSearchParams(window.location.search)
      const hash =
        window.location.hash && window.location.hash.length > 1
          ? new URLSearchParams(window.location.hash.slice(1))
          : new URLSearchParams()

      const errParam = search.get('error') || hash.get('error')
      const errDesc = search.get('error_description') || hash.get('error_description')
      if (errParam) {
        if (!cancelled) {
          setPhase('error')
          setMessage(
            errDesc
              ? decodeURIComponent(String(errDesc).replace(/\+/g, ' '))
              : STRINGS[lang].authResetPasswordInvalidLink,
          )
        }
        return
      }

      const code = search.get('code')
      if (code) {
        const { error } = await supabase.auth.exchangeCodeForSession(code)
        if (cancelled) return
        if (error) {
          setPhase('error')
          setMessage(STRINGS[lang].authResetPasswordInvalidLink)
          return
        }
        window.history.replaceState({}, document.title, '/auth/reset-password')
        setPhase('form')
        return
      }

      const accessToken = hash.get('access_token')
      const refreshToken = hash.get('refresh_token')
      if (accessToken) {
        const { error } = await supabase.auth.setSession({
          access_token: accessToken,
          refresh_token: refreshToken ?? '',
        })
        if (cancelled) return
        if (error) {
          setPhase('error')
          setMessage(STRINGS[lang].authResetPasswordInvalidLink)
          return
        }
        window.history.replaceState({}, document.title, '/auth/reset-password')
        setPhase('form')
        return
      }

      const { data: { session } } = await supabase.auth.getSession()
      if (cancelled) return
      if (session) {
        setPhase('form')
        return
      }

      setPhase('error')
      setMessage(STRINGS[lang].authResetPasswordInvalidLink)
    }

    establishSession()
    return () => {
      cancelled = true
    }
  }, [lang])

  async function handleSubmit(e) {
    e.preventDefault()
    setFormError('')
    if (password.length < 6) {
      setFormError(t.authResetPasswordTooShort)
      return
    }
    if (password !== confirm) {
      setFormError(t.authResetPasswordMismatch)
      return
    }
    setSaving(true)
    try {
      const { error } = await supabase.auth.updateUser({ password })
      if (error) {
        setFormError(error.message ?? 'No se pudo actualizar.')
        return
      }
      await supabase.auth.signOut()
      navigate('/login', { replace: true, state: { passwordReset: true } })
    } catch (err) {
      setFormError(err?.message ?? 'Error inesperado.')
    } finally {
      setSaving(false)
    }
  }

  if (phase === 'loading') {
    return (
      <AuthPageShell mode="login">
        <div className="flex flex-col items-center justify-center py-16">
          <div className="h-10 w-10 animate-spin rounded-full border-2 border-[#00ff9f]/30 border-t-[#00ff9f]" />
          <p className="mt-6 text-sm text-[#8fa3b0]">{t.authResetPasswordLoading}</p>
        </div>
      </AuthPageShell>
    )
  }

  if (phase === 'error') {
    return (
      <AuthPageShell mode="login">
        <h1 className="text-2xl font-semibold text-white">{t.authResetPasswordTitle}</h1>
        <p className="mt-4 text-sm leading-relaxed text-[#94a3b3]">{message}</p>
        <div className="mt-10 flex flex-col gap-3">
          <Link
            to="/forgot-password"
            className="block rounded-xl bg-[#00ff9f] py-3.5 text-center text-sm font-semibold text-[#05120c]"
          >
            {t.authForgotPasswordTitle}
          </Link>
          <Link
            to="/login"
            className="block rounded-xl border border-[#2a414f] py-3.5 text-center text-sm text-[#b8c8d4]"
          >
            {t.authGoLogin}
          </Link>
        </div>
      </AuthPageShell>
    )
  }

  return (
    <AuthPageShell mode="login">
      <h1 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
        {t.authResetPasswordTitle}
      </h1>
      <p className="mt-3 text-base text-[#8fa3b0]">{t.authResetPasswordSubtitle}</p>

      <form onSubmit={handleSubmit} className="mt-10 space-y-6">
        <div>
          <label htmlFor="reset-pass" className="text-xs font-semibold uppercase tracking-wider text-[#6ee7b7]">
            {t.authResetPasswordNew}
          </label>
          <input
            id="reset-pass"
            type="password"
            autoComplete="new-password"
            required
            minLength={6}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={inputClass}
          />
        </div>
        <div>
          <label htmlFor="reset-confirm" className="text-xs font-semibold uppercase tracking-wider text-[#6ee7b7]">
            {t.authResetPasswordConfirm}
          </label>
          <input
            id="reset-confirm"
            type="password"
            autoComplete="new-password"
            required
            minLength={6}
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            className={inputClass}
          />
        </div>
        {formError && (
          <p className="rounded-xl border border-red-500/25 bg-red-950/40 px-4 py-3 text-sm text-red-100">
            {formError}
          </p>
        )}
        <motion.button
          type="submit"
          disabled={saving}
          whileHover={{ scale: saving ? 1 : 1.01 }}
          whileTap={{ scale: saving ? 1 : 0.99 }}
          className="w-full rounded-xl bg-[#00ff9f] py-4 text-base font-semibold text-[#05120c] shadow-[0_0_32px_rgba(0,255,159,0.22)] disabled:opacity-60"
        >
          {saving ? t.authResetPasswordSaving : t.authResetPasswordSubmit}
        </motion.button>
      </form>

      <p className="mt-10 text-center text-sm text-[#7a8a99]">
        <Link to="/login" className="font-medium text-[#00ff9f] hover:underline">
          {t.authForgotPasswordBackLogin}
        </Link>
      </p>
    </AuthPageShell>
  )
}
