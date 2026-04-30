import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Link, NavLink, Outlet, useLocation, useSearchParams } from 'react-router-dom'
import {
  ChevronDown,
  CreditCard,
  LayoutDashboard,
  LogOut,
  Menu,
  Plus,
  Settings,
  X,
} from 'lucide-react'
import { useAuth } from '../../hooks/useAuth'
import { useVerificationGate } from '../../context/VerificationGateContext'
import { useDashboardWorkspace } from '../../context/DashboardWorkspaceContext'
import { Button } from './ui'
import { supabase } from '../../lib/supabase'
import { syncStripeSubscriptionFromServer } from '../../lib/stripeCheckout'
import { getBusinessTypeLabel, getPosUrlForBusiness, normalizeBusinessType } from '../../lib/workspace'
import { createBusinessAndMembership } from '../../lib/supabase'
import { getOnboardingErrorMessage } from '../../lib/onboardingErrors'
import { ModalPanel } from '../Modal'

const nav = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/settings', label: 'Cuenta', icon: Settings },
  { to: '/subscription', label: 'Suscripción', icon: CreditCard },
]

function subscriptionBadgeTone(status) {
  const value = String(status ?? '').toLowerCase()
  if (value === 'active') return 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300'
  if (value === 'trialing') return 'border-amber-500/30 bg-amber-500/10 text-amber-300'
  if (value === 'past_due') return 'border-red-500/30 bg-red-500/10 text-red-300'
  if (value === 'canceled') return 'border-red-500/30 bg-red-500/10 text-red-300'
  return 'border-white/15 bg-white/5 text-slate-300'
}

function subscriptionBadgeLabel(status) {
  const value = String(status ?? '').toLowerCase()
  if (value === 'trialing') return 'Trial activo'
  if (value === 'active') return 'Activo'
  if (value === 'past_due') return 'Pago pendiente'
  if (value === 'canceled') return 'Cancelado'
  return 'Sin estado'
}

function businessTypeBadge(type) {
  const normalized = normalizeBusinessType(type)
  if (normalized === 'restaurant') return 'RESTAURANT'
  if (normalized === 'gym') return 'GYM'
  return 'COMMERCE'
}

export default function DashboardLayout() {
  const { signOut } = useAuth()
  const { ensureVerified } = useVerificationGate()
  const {
    profile,
    stores,
    primaryBusiness,
    setPrimaryBusinessId,
    loading,
    loadError,
    showPaywall,
    refresh,
    planLabel,
  } = useDashboardWorkspace()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [upgrading, setUpgrading] = useState(false)
  const [stuck, setStuck] = useState(false)
  const [searchParams, setSearchParams] = useSearchParams()
  const location = useLocation()
  const checkoutOk = searchParams.get('checkout') === 'success'
  const [subscriptionStatus, setSubscriptionStatus] = useState('trialing')
  const [businessDropdownOpen, setBusinessDropdownOpen] = useState(false)
  const [createBizOpen, setCreateBizOpen] = useState(false)
  const [newBusinessName, setNewBusinessName] = useState('')
  const [newBusinessType, setNewBusinessType] = useState('retail')
  const [creatingBusiness, setCreatingBusiness] = useState(false)
  const [createBusinessError, setCreateBusinessError] = useState('')
  const businessDropdownRef = useRef(null)

  const CREATE_BUSINESS_TYPES = [
    { value: 'retail', label: 'Commerce' },
    { value: 'restaurant', label: 'Restaurante' },
    { value: 'gym', label: 'Gimnasio' },
  ]

  useEffect(() => {
    if (!loading) {
      setStuck(false)
      return
    }
    const t = setTimeout(() => setStuck(true), 15000)
    return () => clearTimeout(t)
  }, [loading])

  useEffect(() => {
    if (checkoutOk !== true) return
    let cancelled = false

    async function syncThenRefresh() {
      try {
        await syncStripeSubscriptionFromServer()
      } catch {
        /* función no desplegada o red */
      }
      if (!cancelled) await refresh()
    }

    void refresh()
    const timeouts = [600, 2200, 5500].map((ms) =>
      setTimeout(() => {
        void syncThenRefresh()
      }, ms),
    )

    return () => {
      cancelled = true
      timeouts.forEach(clearTimeout)
    }
  }, [checkoutOk, refresh])

  useEffect(() => {
    if (!primaryBusiness?.id) {
      setSubscriptionStatus('trialing')
      return
    }
    let cancelled = false
    ;(async () => {
      const { data, error } = await supabase
        .from('saas_subscriptions')
        .select('status, updated_at')
        .eq('business_id', primaryBusiness.id)
        .order('updated_at', { ascending: false })
        .limit(1)
        .maybeSingle()
      if (cancelled) return
      if (error) {
        setSubscriptionStatus(String(primaryBusiness?.billing_status ?? 'trialing').toLowerCase())
        return
      }
      setSubscriptionStatus(String(data?.status ?? primaryBusiness?.billing_status ?? 'trialing').toLowerCase())
    })()
    return () => {
      cancelled = true
    }
  }, [primaryBusiness?.id, primaryBusiness?.billing_status])

  useEffect(() => {
    if (!businessDropdownOpen) return
    function onClickOutside(event) {
      if (!businessDropdownRef.current) return
      if (!businessDropdownRef.current.contains(event.target)) {
        setBusinessDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', onClickOutside)
    return () => document.removeEventListener('mousedown', onClickOutside)
  }, [businessDropdownOpen])

  async function handleUpgradePro() {
    const ok = await ensureVerified()
    if (!ok) return
    setUpgrading(true)
    try {
      const uid = profile?.id
      if (!uid) return
      const { error } = await supabase
        .from('profiles')
        .update({ plan: 'pro', billing_status: 'active' })
        .eq('id', uid)
      if (error) throw error
      await refresh()
    } catch (err) {
      if (import.meta.env.DEV) console.error(err)
    } finally {
      setUpgrading(false)
    }
  }

  function dismissCheckoutBanner() {
    searchParams.delete('checkout')
    setSearchParams(searchParams, { replace: true })
  }

  async function handleCreateBusiness(e) {
    e.preventDefault()
    setCreateBusinessError('')
    if (!newBusinessName.trim()) return
    setCreatingBusiness(true)
    try {
      const ok = await ensureVerified()
      if (!ok) return
      const { businessId, error } = await createBusinessAndMembership(newBusinessName.trim(), newBusinessType)
      if (error) throw error
      await refresh()
      if (businessId) setPrimaryBusinessId(businessId)
      setCreateBizOpen(false)
      setNewBusinessName('')
      setNewBusinessType('retail')
    } catch (err) {
      setCreateBusinessError(getOnboardingErrorMessage(err))
    } finally {
      setCreatingBusiness(false)
    }
  }

  const email = profile?.email ?? '—'
  const businessStatus = subscriptionStatus

  return (
    <div className="relative min-h-screen bg-[#0A0A0A] text-[#e2e8f0]">

      {/* Mobile sidebar */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      <aside
        className={`fixed left-0 top-0 z-50 flex h-full w-64 flex-col border-r border-white/[0.08] bg-[#111111]/95 backdrop-blur-xl transition-transform lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between border-b border-white/[0.06] px-4 py-4">
          <Link to="/dashboard" className="inline-flex items-center gap-2 text-lg font-bold tracking-tight text-[#22c55e]">
            <img src="/icon.png" alt="MoneyMachine" className="h-7 w-7 rounded-md object-cover" />
            MoneyMachine
          </Link>
          <button
            type="button"
            className="rounded-lg p-2 text-[#94a3b8] lg:hidden"
            onClick={() => setSidebarOpen(false)}
            aria-label="Cerrar menú"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <nav className="flex flex-1 flex-col gap-0.5 p-3">
          {nav.map((item) => {
            const NavIcon = item.icon
            return (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={() => setSidebarOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
                    isActive ? 'bg-[#22c55e]/15 text-[#86efac]' : 'text-[#94a3b8] hover:bg-white/[0.04] hover:text-white'
                  }`
                }
              >
                <NavIcon className="h-5 w-5 shrink-0 opacity-80" />
                {item.label}
              </NavLink>
            )
          })}
        </nav>
        <div className="border-t border-white/[0.06] p-3 text-xs text-[#64748b]">
          Plan: <span className="text-[#a7f3d0]">{planLabel}</span>
        </div>
      </aside>

      <div className="lg:pl-64">
        <header className="sticky top-0 z-30 flex flex-wrap items-center justify-between gap-3 border-b border-white/[0.08] bg-[#111111]/90 px-4 py-3 backdrop-blur-md sm:px-6">
          <div className="flex items-center gap-3">
            <button
              type="button"
              className="rounded-lg p-2 text-[#94a3b8] lg:hidden"
              onClick={() => setSidebarOpen(true)}
              aria-label="Abrir menú"
            >
              <Menu className="h-5 w-5" />
            </button>
            <div className="relative" ref={businessDropdownRef}>
              <button
                type="button"
                onClick={() => setBusinessDropdownOpen((v) => !v)}
                className="inline-flex min-w-[220px] items-center gap-3 rounded-xl border border-white/10 bg-[#0A0A0A] px-3 py-2 text-left hover:border-white/20 hover:bg-white/[0.03]"
              >
                {primaryBusiness?.logo_url ? (
                  <img src={primaryBusiness.logo_url} alt="" className="h-8 w-8 rounded-lg object-cover" />
                ) : (
                  <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-white/10 text-xs font-semibold text-white">
                    {(primaryBusiness?.name ?? 'N').slice(0, 1).toUpperCase()}
                  </span>
                )}
                <span className="min-w-0 flex-1">
                  <span className="flex items-center gap-1 truncate text-sm font-semibold text-white">
                    {primaryBusiness?.name ?? 'Selecciona negocio'}
                    <ChevronDown className={`h-4 w-4 text-[#94a3b8] transition-transform ${businessDropdownOpen ? 'rotate-180' : ''}`} />
                  </span>
                  <span className="block truncate text-xs text-[#94a3b8]">{getBusinessTypeLabel(primaryBusiness?.type)}</span>
                </span>
              </button>
              {businessDropdownOpen ? (
                <div className="absolute left-0 top-[calc(100%+8px)] z-20 w-[300px] rounded-xl border border-white/10 bg-[#111111] p-1 shadow-2xl">
                  {stores.map((s) => (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => {
                        setPrimaryBusinessId(s.id)
                        setBusinessDropdownOpen(false)
                      }}
                      className={`flex w-full items-center gap-3 rounded-lg px-2.5 py-2 text-left ${
                        s.id === primaryBusiness?.id ? 'bg-[#22c55e]/15' : 'hover:bg-white/5'
                      }`}
                    >
                      {s.logo_url ? (
                        <img src={s.logo_url} alt="" className="h-8 w-8 rounded-lg object-cover" />
                      ) : (
                        <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-white/10 text-xs font-semibold text-white">
                          {(s.name ?? 'N').slice(0, 1).toUpperCase()}
                        </span>
                      )}
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-sm font-medium text-white">{s.name}</span>
                        <span className="block truncate text-xs text-[#94a3b8]">{getBusinessTypeLabel(s.type)}</span>
                      </span>
                    </button>
                  ))}
                  <div className="my-1 border-t border-white/10" />
                  <button
                    type="button"
                    onClick={() => {
                      setCreateBizOpen(true)
                      setBusinessDropdownOpen(false)
                    }}
                    className="flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-left text-sm font-medium text-[#86efac] hover:bg-[#22c55e]/10"
                  >
                    <Plus className="h-4 w-4" />
                    Crear nuevo negocio
                  </button>
                </div>
              ) : null}
            </div>
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            {primaryBusiness ? (
              <span className="inline-flex rounded-full border border-[#22c55e]/40 bg-[#22c55e]/15 px-3 py-1 text-[11px] font-bold tracking-[0.08em] text-[#86efac]">
                {businessTypeBadge(primaryBusiness.type)}
              </span>
            ) : null}
            <span
              className={`hidden rounded-full border px-2.5 py-1 text-xs font-semibold uppercase tracking-wide sm:inline-flex ${subscriptionBadgeTone(
                businessStatus,
              )}`}
            >
              {subscriptionBadgeLabel(businessStatus)}
            </span>
            {primaryBusiness ? (
              <a
                href={getPosUrlForBusiness(primaryBusiness)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center rounded-xl bg-[#22c55e] px-3 py-2 text-xs font-semibold text-[#052e16] hover:bg-[#4ade80]"
              >
                Open POS
              </a>
            ) : null}
            <span className="hidden max-w-[160px] truncate text-sm text-[#94a3b8] sm:inline">{email}</span>
            <Button variant="secondary" className="!py-2 !text-xs" onClick={() => signOut()}>
              <LogOut className="h-4 w-4" />
              Salir
            </Button>
          </div>
        </header>

        {checkoutOk ? (
          <div className="mx-4 mt-4 flex items-center justify-between gap-3 rounded-xl border border-[#22c55e]/30 bg-[#22c55e]/10 px-4 py-3 text-sm text-[#bbf7d0] sm:mx-6">
            <span>
              Pago recibido. Estamos actualizando tu plan automáticamente (Stripe + tu cuenta). Suele tardar unos
              segundos.
            </span>
            <button type="button" className="shrink-0 text-[#86efac] underline" onClick={dismissCheckoutBanner}>
              Cerrar
            </button>
          </div>
        ) : null}

        <main className="relative z-10 px-4 py-8 sm:px-6 lg:px-8">
          {loading ? (
            stuck ? (
              <div className="rounded-2xl border border-yellow-500/20 bg-[#111111] p-6 text-[#e2e8f0]">
                <p className="text-sm text-[#94a3b8]">
                  Sigue cargando demasiado. Normalmente es una sesión de Supabase atorada o una consulta bloqueada por red/RLS.
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  <Button variant="secondary" onClick={() => refresh()}>
                    Reintentar
                  </Button>
                  <Button onClick={() => signOut()}>Cerrar sesión</Button>
                </div>
              </div>
            ) : (
              <div className="flex justify-center py-24">
                <div className="h-10 w-10 animate-spin rounded-full border-2 border-[#22c55e]/30 border-t-[#22c55e]" />
              </div>
            )
          ) : loadError ? (
            <div className="rounded-2xl border border-red-500/20 bg-[#111111] p-6 text-red-200">
              <p>{loadError}</p>
              <button type="button" className="mt-4 text-sm text-[#22c55e] underline" onClick={() => refresh()}>
                Reintentar
              </button>
            </div>
          ) : (
            <Outlet />
          )}
        </main>
      </div>

      <AnimatePresence>
        {showPaywall && location.pathname !== '/subscription' && (
          <motion.div
            key="paywall-banner"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-4 left-4 right-4 z-[200] mx-auto max-w-3xl rounded-2xl border border-yellow-500/30 bg-[#1f2937]/95 p-4 text-sm text-[#e5e7eb] shadow-xl backdrop-blur"
          >
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="font-semibold text-yellow-300">Tu prueba terminó</p>
                <p className="mt-1 text-xs text-[#9ca3af]">
                  Puedes seguir usando el panel, pero algunas acciones podrían requerir activar un plan de pago.
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button
                  size="sm"
                  disabled={upgrading}
                  onClick={handleUpgradePro}
                >
                  {upgrading ? '…' : 'Activar Pro (demo)'}
                </Button>
                <Link
                  to="/subscription"
                  className="inline-flex items-center justify-center rounded-xl border border-white/15 px-3 py-2 text-xs font-semibold text-white hover:border-[#22c55e]/40"
                >
                  Ver suscripción
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {createBizOpen ? (
        <div
          className="fixed inset-0 z-[250] flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm"
          role="presentation"
          onClick={() => !creatingBusiness && setCreateBizOpen(false)}
        >
          <div onClick={(e) => e.stopPropagation()}>
            <ModalPanel>
              <h2 className="text-lg font-semibold text-white">Crear nuevo negocio</h2>
              <p className="mt-1 text-sm text-[#94a3b8]">
                Cada negocio tiene datos y suscripción aislados. El tipo queda fijo al crearlo.
              </p>
              <form onSubmit={handleCreateBusiness} className="mt-6 space-y-4">
                <div>
                  <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-[#64748b]">Nombre</label>
                  <input
                    value={newBusinessName}
                    onChange={(e) => setNewBusinessName(e.target.value)}
                    placeholder="Ej. CYBER Centro"
                    className="w-full rounded-xl border border-white/10 bg-[#0c1016] px-4 py-2.5 text-sm text-white placeholder:text-[#64748b] outline-none transition-colors focus:border-[#22c55e]/50 focus:ring-1 focus:ring-[#22c55e]/30"
                    required
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-[#64748b]">Tipo</label>
                  <select
                    value={newBusinessType}
                    onChange={(e) => setNewBusinessType(e.target.value)}
                    className="w-full cursor-pointer rounded-xl border border-white/10 bg-[#0c1016] px-4 py-2.5 text-sm text-white outline-none transition-colors focus:border-[#22c55e]/50"
                  >
                    {CREATE_BUSINESS_TYPES.map((t) => (
                      <option key={t.value} value={t.value}>
                        {t.label}
                      </option>
                    ))}
                  </select>
                </div>
                {createBusinessError ? <p className="text-sm text-red-300">{createBusinessError}</p> : null}
                <div className="flex gap-2 pt-2">
                  <Button type="submit" disabled={creatingBusiness} className="flex-1">
                    {creatingBusiness ? 'Creando…' : 'Crear negocio'}
                  </Button>
                  <Button type="button" variant="secondary" disabled={creatingBusiness} onClick={() => setCreateBizOpen(false)}>
                    Cancelar
                  </Button>
                </div>
              </form>
            </ModalPanel>
          </div>
        </div>
      ) : null}
    </div>
  )
}
