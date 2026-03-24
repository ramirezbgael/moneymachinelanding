import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { Sparkles } from 'lucide-react'
import { Card, Button } from './ui'
import {
  deriveSubscriptionSnapshot,
  formatSubscriptionDate,
  getTrialDaysRemaining,
  getTrialProgressInfo,
} from '../../lib/subscriptionDisplay'

const badgeToneClass = {
  trial: 'border-emerald-500/35 bg-emerald-500/10 text-[#86efac]',
  active: 'border-[#22c55e]/40 bg-[#22c55e]/15 text-[#bbf7d0]',
  canceled: 'border-white/10 bg-white/5 text-[#94a3b8]',
  muted: 'border-white/10 bg-white/[0.04] text-[#8a9ba8]',
  warning: 'border-amber-500/35 bg-amber-500/10 text-amber-100',
}

/**
 * Card informativo del plan actual (trial, activo, cancelado, sin suscripción).
 *
 * @param {{
 *   profile: object | null,
 *   activeSubscription: object | null,
 *   latestSubscription: object | null,
 *   onUpgrade: () => void,
 *   onManageSubscription: () => void | Promise<void>,
 *   className?: string
 * }} props
 */
export function CurrentPlanCard({
  profile,
  activeSubscription,
  latestSubscription,
  onUpgrade,
  onManageSubscription,
  className = '',
}) {
  const [portalBusy, setPortalBusy] = useState(false)

  const snapshot = useMemo(
    () =>
      deriveSubscriptionSnapshot({
        profile,
        activeSubscription,
        latestSubscription,
      }),
    [profile, activeSubscription, latestSubscription],
  )

  const trialProgress = useMemo(() => {
    if (!snapshot.showTrialProgress || !snapshot.trialProgressFrom) return null
    return getTrialProgressInfo(snapshot.trialProgressFrom)
  }, [snapshot.showTrialProgress, snapshot.trialProgressFrom])

  const daysToExpiry = useMemo(() => {
    if (!snapshot.expiryDate) return null
    return getTrialDaysRemaining(snapshot.expiryDate)
  }, [snapshot.expiryDate])

  async function handleManage() {
    setPortalBusy(true)
    try {
      await onManageSubscription()
    } finally {
      setPortalBusy(false)
    }
  }

  const showUpgradeCopy =
    snapshot.primaryCta === 'upgrade' &&
    (snapshot.kind === 'marketing_trial' ||
      snapshot.kind === 'canceled' ||
      snapshot.kind === 'none' ||
      snapshot.kind === 'trial_ended')

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      whileHover={{ y: -2 }}
      className={`min-h-[min(22rem,100%)] ${className}`}
    >
      <Card className="group relative flex h-full min-h-[280px] flex-col overflow-hidden border-[#22c55e]/20 bg-gradient-to-br from-[#0f172a]/90 via-[#0a1219] to-[#052e16]/30 p-0 transition-shadow duration-300 hover:border-[#22c55e]/35 hover:shadow-[0_0_40px_rgba(34,197,94,0.12)]">
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage: `radial-gradient(circle at 20% 0%, #22c55e 0%, transparent 45%),
              radial-gradient(circle at 100% 100%, #0ea5e9 0%, transparent 40%)`,
          }}
        />

        <div className="relative flex flex-1 flex-col justify-center gap-5 p-6">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <span
                className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-black/30 text-2xl shadow-inner transition-transform duration-300 group-hover:scale-105"
                aria-hidden
              >
                {snapshot.emoji}
              </span>
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#64748b]">
                  Plan actual
                </p>
                <h2 className="mt-1 text-3xl font-bold tracking-tight text-white">{snapshot.planName}</h2>
              </div>
            </div>
            <span
              className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold ${badgeToneClass[snapshot.badgeTone] ?? badgeToneClass.muted}`}
            >
              <Sparkles className="h-3.5 w-3.5 opacity-80" aria-hidden />
              {snapshot.badgeLabel}
            </span>
          </div>

          <p className="text-sm leading-relaxed text-[#94a3b8]">{snapshot.statusLine}</p>

          <dl className="grid gap-3 text-sm sm:grid-cols-2">
            <div className="rounded-xl border border-white/5 bg-black/20 px-4 py-3">
              <dt className="text-xs font-medium uppercase tracking-wider text-[#64748b]">Estado</dt>
              <dd className="mt-1 font-mono text-[13px] text-[#cbd5e1]">{snapshot.stripeStatus}</dd>
            </div>
            <div className="rounded-xl border border-white/5 bg-black/20 px-4 py-3">
              <dt className="text-xs font-medium uppercase tracking-wider text-[#64748b]">
                {snapshot.kind === 'active' || snapshot.kind === 'payment_issue'
                  ? 'Próxima renovación / fin de periodo'
                  : 'Fecha de expiración'}
              </dt>
              <dd className="mt-1 text-[#e2e8f0]">
                {snapshot.expiryDate ? formatSubscriptionDate(snapshot.expiryDate) : '—'}
              </dd>
            </div>
          </dl>

          {snapshot.kind === 'stripe_trial' && daysToExpiry !== null && daysToExpiry > 0 ? (
            <p className="text-sm text-[#86efac]">
              Quedan <strong>{daysToExpiry}</strong> {daysToExpiry === 1 ? 'día' : 'días'} en tu trial de Stripe.
            </p>
          ) : null}

          {trialProgress && !trialProgress.isExpired ? (
            <div className="space-y-2">
              <div className="flex justify-between text-xs text-[#64748b]">
                <span>Progreso del trial</span>
                <span>
                  {trialProgress.daysRemaining}{' '}
                  {trialProgress.daysRemaining === 1 ? 'día restante' : 'días restantes'}
                </span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-white/10">
                <motion.div
                  className="h-full rounded-full bg-gradient-to-r from-[#15803d] to-[#4ade80]"
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min(100, trialProgress.percentElapsed)}%` }}
                  transition={{ duration: 0.6, ease: 'easeOut' }}
                  title={`${Math.round(trialProgress.percentElapsed)}% del periodo de prueba transcurrido`}
                />
              </div>
            </div>
          ) : null}

          <div className="mt-auto flex flex-col gap-2 border-t border-white/10 pt-5">
            {snapshot.primaryCta === 'manage' ? (
              <Button
                type="button"
                variant="primary"
                disabled={portalBusy}
                className="w-full sm:w-auto"
                onClick={() => void handleManage()}
              >
                {portalBusy ? 'Abriendo portal…' : 'Gestionar suscripción'}
              </Button>
            ) : (
              <Button type="button" variant="primary" className="w-full sm:w-auto" onClick={onUpgrade}>
                Actualizar a Pro
              </Button>
            )}

            {showUpgradeCopy ? (
              <p className="text-center text-xs text-[#64748b] sm:text-left">
                No perderás tu información al actualizar.
              </p>
            ) : snapshot.primaryCta === 'manage' ? (
              <p className="text-center text-xs text-[#64748b] sm:text-left">
                Cambia plan, método de pago o facturas desde el portal seguro de Stripe.
              </p>
            ) : null}
          </div>
        </div>
      </Card>
    </motion.div>
  )
}
