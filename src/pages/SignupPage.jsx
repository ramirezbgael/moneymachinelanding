import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { getFriendlySignUpErrorMessage } from '../lib/authErrors'
import { supabase, upsertProfileAfterSignup, getAuthCallbackUrl } from '../lib/supabase'
import { useAuth } from '../hooks/useAuth'
import { useLocale } from '../i18n'
import { PostAuthRedirect } from '../components/PostAuthRedirect'
import { AuthPageShell } from '../components/auth/AuthPageShell'

const inputClass =
  'mt-2 w-full rounded-xl border border-[#2a3f4d] bg-[#0a1016] px-4 py-3.5 text-base text-white outline-none transition-[border-color,box-shadow] placeholder:text-[#4a5c6a] focus:border-[#00ff9f]/45 focus:ring-2 focus:ring-[#00ff9f]/15'

export default function SignupPage() {
  const { user, loading } = useAuth()
  const { lang, t } = useLocale()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [error, setError] = useState('')
  const [info, setInfo] = useState('')
  const [submitting, setSubmitting] = useState(false)

  if (!loading && user) {
    return <PostAuthRedirect />
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setInfo('')
    setSubmitting(true)
    try {
      const { data, error: signErr } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          emailRedirectTo: getAuthCallbackUrl(),
          data: { full_name: name.trim() || undefined },
        },
      })
      if (signErr) {
        setError(getFriendlySignUpErrorMessage(signErr, { lang }))
        return
      }

      const u = data.user
      if (u && data.session) {
        const { error: profileErr } = await upsertProfileAfterSignup(u, name.trim() || null)
        if (profileErr) {
          if (import.meta.env.DEV) console.error(profileErr)
          setError(
            'Tu cuenta se creó pero hubo un problema al preparar tu perfil. Intenta iniciar sesión o contacta soporte.',
          )
        }
      }

      if (data.session) {
        navigate('/dashboard', { replace: true })
      } else {
        setInfo(
          'Te enviamos un correo de verificación. Abre el enlace para confirmar y entrar automáticamente al panel.',
        )
      }
    } catch (err) {
      setError(getFriendlySignUpErrorMessage(err, { lang }))
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <AuthPageShell mode="register">
      <h1 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">{t.authRegisterTitle}</h1>
      <p className="mt-3 text-base text-[#8fa3b0]">{t.authRegisterSubtitle}</p>

      <form onSubmit={handleSubmit} className="mt-10 space-y-6">
        <div>
          <label htmlFor="reg-email" className="text-xs font-semibold uppercase tracking-wider text-[#6ee7b7]">
            {t.authEmail}
          </label>
          <input
            id="reg-email"
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
          <label htmlFor="reg-password" className="text-xs font-semibold uppercase tracking-wider text-[#6ee7b7]">
            {t.authPassword}
          </label>
          <input
            id="reg-password"
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
          <label htmlFor="reg-name" className="text-xs font-semibold uppercase tracking-wider text-[#6ee7b7]">
            {t.authNameOptional}
          </label>
          <input
            id="reg-name"
            type="text"
            autoComplete="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={inputClass}
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
          {submitting ? t.authCreating : t.authCreateAccount}
        </motion.button>
      </form>

      <p className="mt-10 text-center text-sm text-[#7a8a99]">
        {t.authHasAccount}{' '}
        <Link to="/login" className="font-medium text-[#00ff9f] hover:underline">
          {t.authGoLogin}
        </Link>
      </p>
    </AuthPageShell>
  )
}
