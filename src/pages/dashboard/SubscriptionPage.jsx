import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { Check } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useDashboardWorkspace } from '../../context/DashboardWorkspaceContext'
import {
  startStripeCheckout,
  getStripePriceId,
  openStripeBillingPortal,
  syncStripeSubscriptionFromServer,
} from '../../lib/stripeCheckout'
import { CurrentPlanCard } from '../../components/dashboard/CurrentPlanCard'
import { useVerificationGate } from '../../context/VerificationGateContext'
import { useLocale } from '../../i18n'
import { Button, Card, PageHeader } from '../../components/dashboard/ui'
import { ModalBackdrop, ModalPanel } from '../../components/Modal'

export default function SubscriptionPage() {
  const { t } = useLocale()
  const { profile, planLabel, isPro, refresh, showPaywall, activeSubscription, latestSubscription } =
    useDashboardWorkspace()
  const { ensureVerified } = useVerificationGate()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [billing, setBilling] = useState(/** @type {'month' | 'year'} */ ('month'))
  const [tier, setTier] = useState(/** @type {'pro' | 'business'} */ ('pro'))
  const [portalError, setPortalError] = useState('')
  const [syncBusy, setSyncBusy] = useState(false)
  const [syncHint, setSyncHint] = useState('')

  const [cancelOpen, setCancelOpen] = useState(false)
  const [cancelStep, setCancelStep] = useState(1)
  const [cancelBusy, setCancelBusy] = useState(false)
  const [cancelError, setCancelError] = useState('')
  const [cancelConfirm, setCancelConfirm] = useState(false)
  const [cancelReason, setCancelReason] = useState('')

  const proPlan = useMemo(() => t.plans.find((p) => p.tier === 'pro'), [t.plans])
  const businessPlan = useMemo(() => t.plans.find((p) => p.tier === 'business'), [t.plans])

  const selectedPriceLabel = useMemo(() => {
    const p = tier === 'business' ? businessPlan : proPlan
    if (!p) return ''
    return billing === 'year' ? p.priceYearly : p.priceMonthly
  }, [tier, billing, proPlan, businessPlan])

  async function handleCheckout() {
    setError('')
    const ok = await ensureVerified()
    if (!ok) return
    const priceId = getStripePriceId(tier, billing === 'year' ? 'year' : 'month')
    if (!priceId?.startsWith('price_')) {
      setError(
        `Falta el Price ID de Stripe para ${tier === 'business' ? 'Business' : 'Pro'} (${billing === 'year' ? 'anual' : 'mensual'}) en .env (VITE_STRIPE_PRICE_*).`,
      )
      return
    }
    setLoading(true)
    try {
      const res = await startStripeCheckout({
        priceId,
        mode: 'subscription',
        cancelUrl: `${window.location.origin}/subscription`,
        planTier: tier,
      })
      if (!res.ok) setError(res.message || 'No se pudo iniciar el pago.')
    } catch (e) {
      if (import.meta.env.DEV) console.error(e)
      setError('Error al conectar con Stripe.')
    } finally {
      setLoading(false)
    }
  }

  function scrollToCheckout() {
    document.getElementById('plan-checkout')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  function handleUpgradeFromCard() {
    setTier('pro')
    setBilling('month')
    scrollToCheckout()
  }

  async function handleManageFromCard() {
    setPortalError('')
    const res = await openStripeBillingPortal()
    if (!res.ok) setPortalError(res.message ?? 'No se pudo abrir el portal de facturación.')
  }

  const canCancel = Boolean(activeSubscription || latestSubscription)

  async function handleCancelConfirm() {
    setCancelBusy(true)
    setCancelError('')
    try {
      const origin = typeof window !== 'undefined' ? window.location.origin : ''
      const res = await openStripeBillingPortal({ returnOrigin: origin, openInNewTab: true })
      if (!res.ok) {
        setCancelError(res.message ?? 'No se pudo abrir el portal para cancelar.')
        return
      }
      // Stripe gestiona la cancelación dentro del portal.
      setCancelOpen(false)
    } finally {
      setCancelBusy(false)
    }
  }

  async function handleSyncStripe() {
    setSyncHint('')
    setPortalError('')
    setSyncBusy(true)
    try {
      const res = await syncStripeSubscriptionFromServer()
      if (res.ok) {
        setSyncHint(`Listo: Stripe reporta «${res.status ?? 'activa'}». Actualizando…`)
        await refresh()
      } else {
        setSyncHint(res.message ?? 'No se pudo sincronizar.')
      }
    } finally {
      setSyncBusy(false)
    }
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <PageHeader
        title="Suscripción"
        subtitle="Elige plan (Pro o Business) y si pagas mensual o anual; después te llevamos a Stripe Checkout."
      />

      {showPaywall ? (
        <Card className="mb-6 border-amber-500/30 bg-amber-500/5">
          <p className="font-medium text-amber-100">Tu periodo de prueba ha finalizado.</p>
          <p className="mt-1 text-sm text-[#94a3b8]">Elige un plan para seguir usando todas las funciones.</p>
        </Card>
      ) : null}

      <div className="grid gap-6 lg:grid-cols-2">
        <div>
          <CurrentPlanCard
            profile={profile}
            activeSubscription={activeSubscription}
            latestSubscription={latestSubscription}
            onUpgrade={handleUpgradeFromCard}
            onManageSubscription={handleManageFromCard}
          />
          {portalError ? <p className="mt-3 text-sm text-red-300">{portalError}</p> : null}
          {canCancel ? (
            <details className="mt-4 rounded-xl border border-white/5 bg-black/15 p-4 text-left">
              <summary className="cursor-pointer text-sm text-[#64748b] transition-colors hover:text-[#94a3b8]">
                Opciones avanzadas
              </summary>
              <div className="mt-3 space-y-3">
                <p className="text-xs text-[#94a3b8]">
                  Cancelar requiere confirmación en varios pasos.
                </p>
                <Button
                  type="button"
                  variant="secondary"
                  className="w-full sm:w-auto border-red-500/30 text-red-200 hover:border-red-400"
                  disabled={cancelBusy}
                  onClick={() => {
                    setCancelError('')
                    setCancelConfirm(false)
                    setCancelReason('')
                    setCancelStep(1)
                    setCancelOpen(true)
                  }}
                >
                  Iniciar cancelación
                </Button>
              </div>
            </details>
          ) : null}
          <details className="mt-4 rounded-xl border border-white/5 bg-black/15 p-4 text-left">
            <summary className="cursor-pointer text-sm text-[#64748b] transition-colors hover:text-[#94a3b8]">
              ¿El plan no coincide después de pagar?
            </summary>
            <p className="mt-3 text-sm text-[#94a3b8]">
              Tras un pago exitoso la app ya intenta sincronizar sola al volver al panel. Si pasaron varios minutos y
              sigue mal, fuerza una lectura desde Stripe (requiere la función{' '}
              <code className="rounded bg-black/40 px-1 text-xs text-[#cbd5e1]">sync-stripe-subscription</code>{' '}
              desplegada):
            </p>
            <Button
              type="button"
              variant="secondary"
              className="mt-3 w-full sm:w-auto"
              disabled={syncBusy}
              onClick={() => void handleSyncStripe()}
            >
              {syncBusy ? 'Sincronizando…' : 'Forzar sincronización con Stripe'}
            </Button>
            {syncHint ? (
              <p
                className={`mt-2 text-xs ${syncHint.startsWith('Listo') ? 'text-[#86efac]' : 'text-amber-200/90'}`}
              >
                {syncHint}
              </p>
            ) : null}
          </details>
        </div>

        <Card id="plan-checkout" className="border-[#22c55e]/25 scroll-mt-24">
          {isPro ? (
            <>
              <h3 className="text-lg font-semibold text-white">Tu suscripción</h3>
              <div className="mt-4 space-y-2 text-sm text-[#86efac]">
                <p className="font-medium">Plan activo: {planLabel}</p>
                {activeSubscription ? (
                  <p className="text-xs text-[#94a3b8]">
                    Stripe: <span className="font-mono text-[#cbd5e1]">{activeSubscription.status}</span>
                    {activeSubscription.current_period_end
                      ? ` · renovación ${new Date(activeSubscription.current_period_end).toLocaleDateString('es-MX')}`
                      : null}
                  </p>
                ) : null}
              </div>
            </>
          ) : (
            <>
              <p className="text-xs font-medium uppercase tracking-wider text-[#64748b]">Facturación</p>
              <div
                className="mt-3 inline-flex rounded-full border border-[#2d404d] bg-[#0a1219] p-1"
                role="group"
                aria-label="Mensual o anual"
              >
                <button
                  type="button"
                  onClick={() => setBilling('month')}
                  className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                    billing === 'month'
                      ? 'bg-[#1a3d32] text-[#b8ffe8] shadow-[0_0_20px_rgba(34,197,94,0.12)]'
                      : 'text-[#8a9ba8] hover:text-white'
                  }`}
                >
                  {t.billingToggleMonthly}
                </button>
                <button
                  type="button"
                  onClick={() => setBilling('year')}
                  className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                    billing === 'year'
                      ? 'bg-[#1a3d32] text-[#b8ffe8] shadow-[0_0_20px_rgba(34,197,94,0.12)]'
                      : 'text-[#8a9ba8] hover:text-white'
                  }`}
                >
                  {t.billingToggleYearly}
                </button>
              </div>

              <p className="mt-6 text-xs font-medium uppercase tracking-wider text-[#64748b]">Elige plan</p>
              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                {[proPlan, businessPlan].filter(Boolean).map((p) => {
                  const selected = (p.tier === 'business' && tier === 'business') || (p.tier === 'pro' && tier === 'pro')
                  const price = billing === 'year' ? p.priceYearly : p.priceMonthly
                  return (
                    <button
                      key={p.tier}
                      type="button"
                      onClick={() => setTier(p.tier === 'business' ? 'business' : 'pro')}
                      className={`rounded-2xl border p-4 text-left transition-colors ${
                        selected
                          ? 'border-[#22c55e] bg-[#22c55e]/10 shadow-[0_0_24px_rgba(34,197,94,0.12)]'
                          : 'border-white/10 bg-black/20 hover:border-white/20'
                      }`}
                    >
                      <p className="text-sm font-semibold tracking-wide text-white">{p.name}</p>
                      <p className="mt-2 text-lg font-semibold text-[#86efac]">{price}</p>
                      <p className="mt-1 text-xs text-[#64748b]">
                        {billing === 'year' ? t.billingToggleYearly : t.billingToggleMonthly}
                      </p>
                    </button>
                  )
                })}
              </div>

              <div className="mt-4 rounded-xl border border-white/5 bg-black/20 p-4">
                <p className="text-sm text-[#94a3b8]">Resumen</p>
                <p className="mt-1 text-white">
                  <span className="font-semibold text-[#22c55e]">{tier === 'business' ? 'Business' : 'Pro'}</span>
                  {' · '}
                  {selectedPriceLabel}
                </p>
                <ul className="mt-3 space-y-1.5 text-sm text-[#cbd5e1]">
                  {(tier === 'business' ? businessPlan?.bullets : proPlan?.bullets)?.slice(0, 4).map((b) => (
                    <li key={b} className="flex items-center gap-2">
                      <Check className="h-3.5 w-3.5 shrink-0 text-[#22c55e]" />
                      {b}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-6 flex flex-col gap-2">
                <Button disabled={loading} onClick={handleCheckout}>
                  {loading ? 'Abriendo Stripe…' : 'Continuar al pago con Stripe'}
                </Button>
                {error ? <p className="text-sm text-red-300">{error}</p> : null}
              </div>
            </>
          )}

          {!isPro ? null : (
            <div className="mt-6 flex flex-col gap-2 border-t border-white/10 pt-6">
              <Link to="/pricing" className="text-center text-sm text-[#22c55e] hover:underline">
                Comparar en la página de precios
              </Link>
              <button
                type="button"
                className="text-center text-xs text-[#64748b] underline"
                onClick={() => refresh()}
              >
                Actualizar estado
              </button>
            </div>
          )}

          {!isPro ? (
            <>
              <Link
                to="/pricing"
                className="mt-4 block text-center text-sm text-[#22c55e] hover:underline"
              >
                Ver tabla completa de precios
              </Link>
              <button
                type="button"
                className="mt-2 w-full text-center text-xs text-[#64748b] underline"
                onClick={() => refresh()}
              >
                Actualizar estado
              </button>
            </>
          ) : null}
        </Card>
      </div>

      {cancelOpen ? (
        <ModalBackdrop onClose={() => !cancelBusy && setCancelOpen(false)}>
          <ModalPanel>
            {cancelStep === 1 ? (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white">Cancelar suscripción</h3>
                <p className="text-sm text-[#94a3b8]">
                  Vas a detener los próximos cobros. La cancelación se completa en el portal seguro de Stripe.
                </p>
                <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
                  <Button variant="secondary" onClick={() => setCancelOpen(false)} disabled={cancelBusy}>
                    Volver
                  </Button>
                  <Button onClick={() => setCancelStep(2)} disabled={cancelBusy}>
                    Continuar
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white">Confirmación</h3>
                <p className="text-sm text-[#94a3b8]">
                  Para evitar cancelaciones accidentales, confirma la acción.
                </p>
                <label className="flex items-start gap-3 text-sm text-[#e2e8f0]">
                  <input
                    type="checkbox"
                    checked={cancelConfirm}
                    onChange={(e) => setCancelConfirm(e.target.checked)}
                    disabled={cancelBusy}
                    className="mt-1"
                  />
                  <span>
                    Entiendo que se cancelarán los próximos cobros y tengo que gestionar el último paso en Stripe.
                  </span>
                </label>
                <div>
                  <label className="text-xs font-medium uppercase tracking-wider text-[#64748b]">Motivo (opcional)</label>
                  <input
                    type="text"
                    value={cancelReason}
                    onChange={(e) => setCancelReason(e.target.value)}
                    disabled={cancelBusy}
                    className="mt-2 w-full rounded-xl border border-white/10 bg-[#0c1016] px-4 py-2.5 text-sm text-white outline-none focus:border-[#22c55e]/50"
                    placeholder="Ej. muy caro, necesito pausar…"
                  />
                </div>
                {cancelError ? <p className="text-sm text-red-300">{cancelError}</p> : null}
                <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
                  <Button variant="secondary" onClick={() => setCancelStep(1)} disabled={cancelBusy}>
                    Atrás
                  </Button>
                  <Button
                    onClick={() => {
                      if (!cancelConfirm) {
                        setCancelError('Marca la casilla para continuar.')
                        return
                      }
                      void handleCancelConfirm()
                    }}
                    disabled={cancelBusy}
                  >
                    {cancelBusy ? 'Abriendo…' : 'Confirmar y continuar en Stripe'}
                  </Button>
                </div>
              </div>
            )}
          </ModalPanel>
        </ModalBackdrop>
      ) : null}
    </motion.div>
  )
}
