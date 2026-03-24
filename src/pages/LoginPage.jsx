import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { getFriendlyAuthErrorMessage } from '../lib/authErrors'
import { fetchUserBusinessesPreview, supabase } from '../lib/supabase'
import { useAuth } from '../hooks/useAuth'
import { useLocale } from '../i18n'
import { PostAuthRedirect } from '../components/PostAuthRedirect'
import { AuthPageShell } from '../components/auth/AuthPageShell'

const inputClass =
  'mt-2 w-full rounded-xl border border-[#2a3f4d] bg-[#0a1016] px-4 py-3.5 text-base text-white outline-none transition-[border-color,box-shadow] placeholder:text-[#4a5c6a] focus:border-[#00ff9f]/45 focus:ring-2 focus:ring-[#00ff9f]/15'

export default function LoginPage() {
  const { user, loading } = useAuth()
  const { lang, t } = useLocale()
  const navigate = useNavigate()
  const location = useLocation()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  if (!loading && user) {
    return <PostAuthRedirect />
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setSubmitting(true)
    try {
      const { error: signErr } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      })
      if (signErr) {
        setError(getFriendlyAuthErrorMessage(signErr, { lang }))
        return
      }
      const { data: sessionData } = await supabase.auth.getSession()
      const u = sessionData.session?.user
      if (u) {
        const from = location.state?.from
        if (typeof from === 'string' && from.startsWith('/')) {
          navigate(from, { replace: true })
          return
        }
        const { data: rows } = await fetchUserBusinessesPreview(u.id)
        navigate(rows?.length ? '/dashboard' : '/onboarding', { replace: true })
      }
    } catch (err) {
      setError(getFriendlyAuthErrorMessage(err, { lang }))
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <AuthPageShell mode="login">
      <h1 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">{t.authLoginTitle}</h1>
      <p className="mt-3 text-base text-[#8fa3b0]">{t.authLoginSubtitle}</p>

      <form onSubmit={handleSubmit} className="mt-10 space-y-6">
        <div>
          <label htmlFor="login-email" className="text-xs font-semibold uppercase tracking-wider text-[#6ee7b7]">
            {t.authEmail}
          </label>
          <input
            id="login-email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={inputClass}
            placeholder="nombre@empresa.com"
          />
        </div>
        <div>
          <label htmlFor="login-password" className="text-xs font-semibold uppercase tracking-wider text-[#6ee7b7]">
            {t.authPassword}
          </label>
          <input
            id="login-password"
            type="password"
            autoComplete="current-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={inputClass}
          />
          <div className="mt-2 flex justify-end">
            <Link to="/forgot-password" className="text-sm text-[#6ee7b7]/90 hover:text-[#00ff9f] hover:underline">
              {t.authForgotPasswordLink}
            </Link>
          </div>
        </div>
        {location.state?.passwordReset && (
          <p className="rounded-xl border border-[#00ff9f]/25 bg-[#00ff9f]/10 px-4 py-3 text-sm text-[#b8ffe8]">
            {t.authLoginAfterReset}
          </p>
        )}
        {error && (
          <p className="rounded-xl border border-red-500/25 bg-red-950/40 px-4 py-3 text-sm text-red-100">
            {error}
          </p>
        )}
        <motion.button
          type="submit"
          disabled={submitting}
          whileHover={{ scale: submitting ? 1 : 1.01 }}
          whileTap={{ scale: submitting ? 1 : 0.99 }}
          className="w-full rounded-xl bg-[#00ff9f] py-4 text-base font-semibold text-[#05120c] shadow-[0_0_32px_rgba(0,255,159,0.22)] disabled:opacity-60"
        >
          {submitting ? t.authSigningIn : t.authSignIn}
        </motion.button>
      </form>

      <p className="mt-10 text-center text-sm text-[#7a8a99]">
        {t.authNoAccount}{' '}
        <Link to="/register" className="font-medium text-[#00ff9f] hover:underline">
          {t.authGoRegister}
        </Link>
      </p>
    </AuthPageShell>
  )
}
