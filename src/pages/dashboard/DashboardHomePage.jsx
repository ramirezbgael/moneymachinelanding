import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ExternalLink, Package, UserPlus, WalletCards } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { useDashboardWorkspace } from '../../context/DashboardWorkspaceContext'
import { Card, PageHeader, Button } from '../../components/dashboard/ui'
import { supabase } from '../../lib/supabase'
import { getBusinessTypeLabel, getPosUrlForBusiness, normalizeBusinessType } from '../../lib/workspace'
import { getPlansByBusinessType, getPrimaryUpgradePlan, resolveCurrentPlan } from '../../lib/pricingPlans'

function statusTone(status) {
  const value = String(status ?? '').toLowerCase()
  if (value === 'active') return 'text-emerald-300'
  if (value === 'trialing') return 'text-amber-300'
  if (value === 'past_due' || value === 'canceled') return 'text-red-300'
  return 'text-slate-300'
}

function subscriptionStatusLabel(status) {
  const value = String(status ?? '').toLowerCase()
  if (value === 'trialing') return 'Trial activo'
  if (value === 'active') return 'Activo'
  if (value === 'past_due') return 'Pago pendiente'
  if (value === 'canceled') return 'Cancelado'
  return 'Sin estado'
}

export default function DashboardHomePage() {
  const { primaryBusiness } = useDashboardWorkspace()
  const [loadingStats, setLoadingStats] = useState(false)
  const [statsError, setStatsError] = useState('')
  const [teamCount, setTeamCount] = useState(0)
  const [locations, setLocations] = useState([])
  const [subscription, setSubscription] = useState(null)

  useEffect(() => {
    if (!primaryBusiness?.id) return
    let cancelled = false
    setLoadingStats(true)
    setStatsError('')

    ;(async () => {
      try {
        const [registersRes, membersRes, subsRes] = await Promise.all([
          supabase
            .from('registers')
            .select('id, name, location')
            .eq('business_id', primaryBusiness.id)
            .order('created_at', { ascending: true }),
          supabase.from('business_members').select('id').eq('business_id', primaryBusiness.id),
          supabase
            .from('saas_subscriptions')
            .select('id, status, stripe_price_id, current_period_end, updated_at')
            .eq('business_id', primaryBusiness.id)
            .order('updated_at', { ascending: false })
            .limit(1)
            .maybeSingle(),
        ])

        if (registersRes.error) throw registersRes.error
        if (membersRes.error) throw membersRes.error
        if (subsRes.error) throw subsRes.error
        if (cancelled) return

        setLocations(registersRes.data ?? [])
        setTeamCount((membersRes.data ?? []).length)
        setSubscription(subsRes.data ?? null)
      } catch (error) {
        if (cancelled) return
        if (import.meta.env.DEV) console.error('[dashboard-home]', error)
        setStatsError('No se pudo cargar el resumen de este negocio.')
      } finally {
        if (!cancelled) setLoadingStats(false)
      }
    })()

    return () => {
      cancelled = true
    }
  }, [primaryBusiness?.id])

  const branches = useMemo(() => {
    const map = new Map()
    for (const reg of locations) {
      const key = (reg.location || reg.name || 'Sin ubicación').trim()
      const current = map.get(key) ?? { label: key, count: 0 }
      current.count += 1
      map.set(key, current)
    }
    return [...map.values()]
  }, [locations])

  const subscriptionStatus = String(subscription?.status ?? primaryBusiness?.billing_status ?? 'trialing').toLowerCase()
  const planCatalog = getPlansByBusinessType(primaryBusiness?.type)
  const currentPlan = resolveCurrentPlan(primaryBusiness?.type, subscription?.stripe_price_id)
  const suggestedUpgrade = getPrimaryUpgradePlan(primaryBusiness?.type)
  const billingDateLabel = subscription?.current_period_end
    ? new Date(subscription.current_period_end).toLocaleDateString('es-MX', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      })
    : '—'
  const planPrice = currentPlan?.priceLabel ?? '—'
  const planUnlocks = currentPlan?.features?.join(', ') ?? '—'
  const isTrial = subscriptionStatus === 'trialing'
  const daysRemaining = subscription?.current_period_end
    ? Math.max(0, Math.ceil((new Date(subscription.current_period_end).getTime() - Date.now()) / 86400000))
    : null
  const subscriptionCtaLabel =
    subscriptionStatus === 'active' && currentPlan?.key === suggestedUpgrade?.key
      ? 'Administrar suscripción'
      : 'Actualizar plan'
  const operationInsight =
    normalizeBusinessType(primaryBusiness?.type) === 'restaurant'
      ? 'Operación conectada: salón, meseros y cocina en tiempo real.'
      : normalizeBusinessType(primaryBusiness?.type) === 'gym'
        ? 'Operación conectada: membresías, accesos y control diario.'
        : 'Operación conectada: ventas, inventario y control en tiempo real.'

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <PageHeader
        title="Workspace de negocio"
        subtitle="Controla tu negocio como una máquina: operación en tiempo real, sin errores y todo conectado."
      />

      {statsError ? (
        <div className="mb-4 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
          {statsError}
        </div>
      ) : null}

      <div className="grid gap-4 xl:grid-cols-12">
        <Card className="xl:col-span-4">
          <p className="text-xs font-medium uppercase tracking-wider text-[#64748b]">Business Overview</p>
          <h2 className="mt-3 text-xl font-semibold text-white">{primaryBusiness?.name ?? 'Sin negocio activo'}</h2>
          <p className="mt-1 text-sm text-[#94a3b8]">{getBusinessTypeLabel(primaryBusiness?.type)}</p>
          <p className="mt-3 rounded-xl border border-white/10 bg-black/20 px-3 py-2 text-xs text-[#9CA3AF]">
            {operationInsight}
          </p>
          <div className="mt-6 grid grid-cols-2 gap-3">
            <div className="rounded-xl border border-white/10 bg-black/20 p-3">
              <p className="text-xs text-[#64748b]">Ubicaciones</p>
              <p className="mt-1 text-lg font-semibold text-white">{branches.length}</p>
            </div>
            <div className="rounded-xl border border-white/10 bg-black/20 p-3">
              <p className="text-xs text-[#64748b]">Dispositivos / equipo</p>
              <p className="mt-1 text-lg font-semibold text-white">{teamCount}</p>
            </div>
          </div>
        </Card>

        <Card className="xl:col-span-4">
          <p className="text-xs font-medium uppercase tracking-wider text-[#64748b]">Suscripción</p>
          <div className="mt-3 space-y-2 text-sm">
            <div className="flex items-center justify-between gap-3">
              <span className="text-[#94a3b8]">Plan</span>
              <span className="font-medium text-white">{currentPlan?.name ?? '—'}</span>
            </div>
            <div className="flex items-center justify-between gap-3">
              <span className="text-[#94a3b8]">Estado</span>
              <span className={`font-medium uppercase ${statusTone(subscriptionStatus)}`}>
                {subscriptionStatusLabel(subscriptionStatus)}
              </span>
            </div>
            <div className="flex items-center justify-between gap-3">
              <span className="text-[#94a3b8]">Precio</span>
              <span className="font-medium text-white">{planPrice}</span>
            </div>
            <div className="flex items-center justify-between gap-3">
              <span className="text-[#94a3b8]">Próximo cobro</span>
              <span className="font-medium text-white">{billingDateLabel}</span>
            </div>
            {isTrial && daysRemaining != null ? (
              <div className="flex items-center justify-between gap-3">
                <span className="text-[#94a3b8]">Días de trial restantes</span>
                <span className="font-medium text-amber-300">{daysRemaining}</span>
              </div>
            ) : null}
          </div>
          <p className="mt-3 text-xs text-[#9CA3AF]">{planUnlocks}</p>
          <div className="mt-4 rounded-xl border border-white/10 bg-black/20 p-3">
            <p className="text-xs font-medium uppercase tracking-wider text-[#64748b]">Opciones disponibles</p>
            <div className="mt-2 space-y-2">
              {planCatalog.map((plan) => (
                <div
                  key={plan.key}
                  className={`rounded-lg border px-2.5 py-2 ${
                    plan.key === currentPlan?.key ? 'border-[#22c55e]/40 bg-[#22c55e]/10' : 'border-white/10 bg-black/20'
                  }`}
                >
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-sm font-semibold text-white">{plan.name}</span>
                    <span className="text-xs text-[#9CA3AF]">{plan.priceLabel}</span>
                  </div>
                  <p className="mt-1 text-xs text-[#9CA3AF]">{plan.features.join(', ')}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="mt-5">
            <Link to="/subscription">
              <Button variant={subscriptionCtaLabel === 'Actualizar plan' ? 'primary' : 'secondary'}>
                {subscriptionCtaLabel}
              </Button>
            </Link>
          </div>
          <p className="mt-2 text-xs text-[#9CA3AF]">7 días gratis, sin tarjeta para iniciar.</p>
        </Card>

        <Card className="xl:col-span-4">
          <p className="text-xs font-medium uppercase tracking-wider text-[#64748b]">Quick Actions</p>
          <div className="mt-4 grid gap-2 sm:grid-cols-2">
            <a
              href={getPosUrlForBusiness(primaryBusiness)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#22c55e] px-3 py-2.5 text-sm font-semibold text-[#052e16] hover:bg-[#4ade80]"
            >
              <ExternalLink className="h-4 w-4" />
              Open POS
            </a>
            <Link
              to="/dashboard"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-sm font-semibold text-white hover:bg-white/10"
            >
              <WalletCards className="h-4 w-4" />
              Ver reportes
            </Link>
            <Link
              to="/modules"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-sm font-semibold text-white hover:bg-white/10"
            >
              <Package className="h-4 w-4" />
              Inventario / operación
            </Link>
            <Link
              to="/users"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-sm font-semibold text-white hover:bg-white/10"
            >
              <UserPlus className="h-4 w-4" />
              Invitar equipo
            </Link>
          </div>
        </Card>

        <Card className="xl:col-span-12">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-[#64748b]">Locations / Branches</p>
              <p className="mt-1 text-sm text-[#94a3b8]">Basado en `registers.location` del negocio activo.</p>
            </div>
            <Link to="/stores">
              <Button>Add location</Button>
            </Link>
          </div>
          <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {branches.map((branch) => (
              <div key={branch.label} className="rounded-xl border border-white/10 bg-black/20 p-4">
                <p className="text-sm font-semibold text-white">{branch.label}</p>
              <p className="mt-1 text-xs text-[#94a3b8]">{branch.count} registro(s) activo(s)</p>
              <p className="mt-1 text-[11px] text-emerald-300">Operativa</p>
              </div>
            ))}
            {!loadingStats && branches.length === 0 ? (
              <div className="rounded-xl border border-white/10 bg-black/20 p-4 text-sm text-[#94a3b8]">
                Aún no hay ubicaciones registradas.
              </div>
            ) : null}
            {loadingStats ? (
              <div className="rounded-xl border border-white/10 bg-black/20 p-4 text-sm text-[#94a3b8]">
                Cargando ubicaciones...
              </div>
            ) : null}
          </div>
        </Card>
      </div>
    </motion.div>
  )
}
