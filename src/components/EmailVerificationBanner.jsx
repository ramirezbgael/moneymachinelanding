import { useState } from 'react'
import { motion } from 'framer-motion'
import { AlertTriangle } from 'lucide-react'
import { useAuth } from '../hooks/useAuth'
import { useVerificationGate } from '../context/VerificationGateContext'

export function EmailVerificationBanner() {
  const { user, emailConfirmed } = useAuth()
  const { resendVerificationEmail } = useVerificationGate()
  const [busy, setBusy] = useState(false)

  if (!user || emailConfirmed) return null

  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative z-[150] border-b border-amber-500/30 bg-amber-950/80 px-4 py-3 text-amber-50 backdrop-blur-md"
      role="status"
    >
      <div className="mx-auto flex max-w-5xl flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
        <p className="flex items-center gap-2 text-sm">
          <AlertTriangle className="h-4 w-4 shrink-0 text-amber-400" />
          <span>
            <strong className="font-semibold">Verify your email</strong> to unlock all features (subscriptions,
            saving data, premium tools).
          </span>
        </p>
        <button
          type="button"
          disabled={busy}
          onClick={async () => {
            setBusy(true)
            try {
              await resendVerificationEmail()
            } finally {
              setBusy(false)
            }
          }}
          className="shrink-0 rounded-lg border border-amber-400/40 bg-amber-500/10 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-amber-100 transition-colors hover:bg-amber-500/20 disabled:opacity-50"
        >
          {busy ? 'Sending…' : 'Resend email'}
        </button>
      </div>
    </motion.div>
  )
}
