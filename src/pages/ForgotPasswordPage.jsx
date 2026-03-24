import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { getPasswordRecoveryUrl, supabase } from '../lib/supabase'
import { useLocale } from '../i18n'
import { AuthPageShell } from '../components/auth/AuthPageShell'

const inputClass =
  'mt-2 w-full rounded-xl border border-[#2a3f4d] bg-[#0a1016] px-4 py-3.5 text-base text-white outline-none transition-[border-color,box-shadow] placeholder:text-[#4a5c6a] focus:border-[#00ff9f]/45 focus:ring-2 focus:ring-[#00ff9f]/15'

export default function ForgotPasswordPage() {
  const { t } = useLocale()
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [info, setInfo] = useState('')
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setInfo('')
    setSubmitting(true)
    try {
      const { error: resetErr } = await supabase.auth.resetPasswordForEmail(email.trim(), {
        redirectTo: getPasswordRecoveryUrl(),
      })
      if (resetErr) {
        setError(resetErr.message || 'No se pudo enviar el correo.')
        return
      }
      setInfo(t.authForgotPasswordSuccess)
    } catch (err) {
      setError(err?.message ?? 'Algo salió mal.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <AuthPageShell mode="login">
      <h1 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
        {t.authForgotPasswordTitle}
      </h1>
      <p className="mt-3 text-base text-[#8fa3b0]">{t.authForgotPasswordSubtitle}</p>

      <form onSubmit={handleSubmit} className="mt-10 space-y-6">
        <div>
          <label htmlFor="forgot-email" className="text-xs font-semibold uppercase tracking-wider text-[#6ee7b7]">
            {t.authEmail}
          </label>
          <input
            id="forgot-email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={inputClass}
            placeholder="nombre@empresa.com"
          />
        </div>
        {error && (
          <p className="rounded-xl border border-red-500/25 bg-red-950/40 px-4 py-3 text-sm text-red-100">
            {error}
          </p>
        )}
        {info && (
          <p className="rounded-xl border border-[#00ff9f]/25 bg-[#00ff9f]/10 px-4 py-3 text-sm text-[#b8ffe8]">
            {info}
          </p>
        )}
        <motion.button
          type="submit"
          disabled={submitting}
          whileHover={{ scale: submitting ? 1 : 1.01 }}
          whileTap={{ scale: submitting ? 1 : 0.99 }}
          className="w-full rounded-xl bg-[#00ff9f] py-4 text-base font-semibold text-[#05120c] shadow-[0_0_32px_rgba(0,255,159,0.22)] disabled:opacity-60"
        >
          {submitting ? t.authForgotPasswordSending : t.authForgotPasswordSubmit}
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
