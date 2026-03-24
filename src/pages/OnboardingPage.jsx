import { useEffect, useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { getOnboardingErrorMessage } from '../lib/onboardingErrors'
import { createBusinessAndMembership, fetchUserBusinessesPreview } from '../lib/supabase'
import { useAuth } from '../hooks/useAuth'
import { useVerificationGate } from '../context/VerificationGateContext'

const BUSINESS_TYPES = [
  { value: 'store', label: 'Tienda / retail' },
  { value: 'gym', label: 'Gimnasio' },
  { value: 'restaurant', label: 'Restaurante / bar' },
  { value: 'services', label: 'Servicios' },
  { value: 'other', label: 'Otro' },
]

export default function OnboardingPage() {
  const { user, loading } = useAuth()
  const { ensureVerified } = useVerificationGate()
  const navigate = useNavigate()
  const [checking, setChecking] = useState(true)
  const [hasBusiness, setHasBusiness] = useState(false)
  const [name, setName] = useState('')
  const [type, setType] = useState('store')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (loading || !user) return
    let cancelled = false
    ;(async () => {
      const { data } = await fetchUserBusinessesPreview(user.id)
      if (!cancelled) {
        setHasBusiness((data?.length ?? 0) > 0)
        setChecking(false)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [user, loading])

  if (loading || (user && checking)) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#05070a]">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-[#00ff9f]/30 border-t-[#00ff9f]" />
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  if (hasBusiness) {
    return <Navigate to="/dashboard" replace />
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    if (!name.trim()) return
    setSubmitting(true)
    try {
      const verified = await ensureVerified()
      if (!verified) return
      const { error: rpcErr } = await createBusinessAndMembership(name.trim(), type)
      if (rpcErr) throw rpcErr
      navigate('/dashboard', { replace: true })
    } catch (err) {
      if (import.meta.env.DEV) console.error('[onboarding]', err)
      setError(getOnboardingErrorMessage(err))
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#05070a] text-[#dce3eb]">
      <div className="grid-bg pointer-events-none absolute inset-0 opacity-30" />
      <motion.div
        className="pointer-events-none absolute -top-24 left-1/2 h-[28rem] w-[28rem] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(0,255,159,0.15),transparent_70%)] blur-2xl"
        animate={{ opacity: [0.5, 0.85, 0.5] }}
        transition={{ duration: 6, repeat: Infinity }}
      />

      <div className="relative z-10 mx-auto flex min-h-screen max-w-md flex-col justify-center px-4 py-16">
        <Link
          to="/"
          className="mb-8 text-sm text-[#7a8a99] transition-colors hover:text-[#00ff9f]"
        >
          ← MoneyMachine
        </Link>
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass rounded-2xl border border-[#2a414f] p-8 shadow-[0_0_48px_rgba(0,255,159,0.08)]"
        >
          <h1 className="text-2xl font-semibold text-white">Configura tu negocio</h1>
          <p className="mt-2 text-sm text-[#8a9aaa]">En menos de 2 minutos quedas listo.</p>
          <form onSubmit={handleSubmit} className="mt-8 space-y-4">
            <div>
              <label
                htmlFor="ob-name"
                className="block text-xs font-medium uppercase tracking-wider text-[#6ee7b7]"
              >
                Nombre del negocio
              </label>
              <input
                id="ob-name"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ej. Mi negocio"
                className="mt-1.5 w-full rounded-xl border border-[#2f4654] bg-[#0b1218] px-4 py-3 text-white outline-none focus:border-[#00ff9f]/50 focus:ring-2 focus:ring-[#00ff9f]/20"
              />
            </div>
            <div>
              <label
                htmlFor="ob-type"
                className="block text-xs font-medium uppercase tracking-wider text-[#6ee7b7]"
              >
                Tipo de negocio
              </label>
              <select
                id="ob-type"
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="mt-1.5 w-full rounded-xl border border-[#2f4654] bg-[#0b1218] px-4 py-3 text-white outline-none focus:border-[#00ff9f]/50"
              >
                {BUSINESS_TYPES.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
            {error && (
              <p className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-200">
                {error}
              </p>
            )}
            <motion.button
              type="submit"
              disabled={submitting}
              whileHover={{ scale: submitting ? 1 : 1.02 }}
              whileTap={{ scale: submitting ? 1 : 0.98 }}
              className="w-full rounded-xl bg-[#00ff9f] py-3.5 font-semibold text-[#05120c] shadow-[0_0_28px_rgba(0,255,159,0.25)] disabled:opacity-60"
            >
              {submitting ? 'Guardando…' : 'Continuar al panel'}
            </motion.button>
          </form>
        </motion.div>
      </div>
    </div>
  )
}
