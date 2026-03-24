import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Link, NavLink, Outlet, useLocation, useSearchParams } from 'react-router-dom'
import {
  CreditCard,
  LayoutDashboard,
  LogOut,
  Menu,
  Package,
  Settings,
  Store,
  Users,
  X,
} from 'lucide-react'
import { useAuth } from '../../hooks/useAuth'
import { useVerificationGate } from '../../context/VerificationGateContext'
import { useDashboardWorkspace } from '../../context/DashboardWorkspaceContext'
import { ModalPanel } from '../Modal'
import { Button } from './ui'
import { supabase } from '../../lib/supabase'
import { syncStripeSubscriptionFromServer } from '../../lib/stripeCheckout'

const nav = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/stores', label: 'Tiendas', icon: Store },
  { to: '/users', label: 'Usuarios', icon: Users },
  { to: '/modules', label: 'Módulos', icon: Package },
  { to: '/subscription', label: 'Suscripción', icon: CreditCard },
  { to: '/settings', label: 'Ajustes', icon: Settings },
]

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
  const [searchParams, setSearchParams] = useSearchParams()
  const location = useLocation()
  const checkoutOk = searchParams.get('checkout') === 'success'

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

  const email = profile?.email ?? '—'

  return (
    <div className="relative min-h-screen bg-[#06080b] text-[#e2e8f0]">
      <div className="pointer-events-none fixed inset-0 opacity-[0.35]">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `
              linear-gradient(rgba(34, 197, 94, 0.04) 1px, transparent 1px),
              linear-gradient(90deg, rgba(34, 197, 94, 0.04) 1px, transparent 1px)`,
            backgroundSize: '48px 48px',
          }}
        />
      </div>

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
        className={`fixed left-0 top-0 z-50 flex h-full w-64 flex-col border-r border-white/[0.06] bg-[#080b10]/95 backdrop-blur-xl transition-transform lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between border-b border-white/[0.06] px-4 py-4">
          <Link to="/dashboard" className="text-lg font-bold tracking-tight text-[#22c55e]">
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
                    isActive
                      ? 'bg-[#22c55e]/15 text-[#86efac]'
                      : 'text-[#94a3b8] hover:bg-white/[0.04] hover:text-white'
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
        <header className="sticky top-0 z-30 flex flex-wrap items-center justify-between gap-3 border-b border-white/[0.06] bg-[#06080b]/90 px-4 py-3 backdrop-blur-md sm:px-6">
          <div className="flex items-center gap-3">
            <button
              type="button"
              className="rounded-lg p-2 text-[#94a3b8] lg:hidden"
              onClick={() => setSidebarOpen(true)}
              aria-label="Abrir menú"
            >
              <Menu className="h-5 w-5" />
            </button>
            {stores.length > 1 ? (
              <div className="hidden items-center gap-2 sm:flex">
                <span className="text-xs text-[#64748b]">Tienda activa</span>
                <select
                  value={primaryBusiness?.id ?? ''}
                  onChange={(e) => setPrimaryBusinessId(e.target.value)}
                  className="max-w-[200px] cursor-pointer rounded-lg border border-white/10 bg-[#0c1016] px-2 py-1.5 text-xs text-white"
                >
                  {stores.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name}
                    </option>
                  ))}
                </select>
              </div>
            ) : null}
          </div>
          <div className="flex items-center gap-3 sm:gap-4">
            <span className="hidden max-w-[200px] truncate text-sm text-[#94a3b8] sm:inline">{email}</span>
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
            <div className="flex justify-center py-24">
              <div className="h-10 w-10 animate-spin rounded-full border-2 border-[#22c55e]/30 border-t-[#22c55e]" />
            </div>
          ) : loadError ? (
            <div className="glass rounded-2xl border border-red-500/20 p-6 text-red-200">
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
            key="paywall"
            role="presentation"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
          >
            <ModalPanel>
              <h2 className="text-xl font-semibold text-white">Tu prueba terminó</h2>
              <p className="mt-2 text-sm text-[#94a3b8]">
                Pásate a Pro para seguir usando MoneyMachine sin límites.
              </p>
              <div className="mt-6 flex flex-col gap-3">
                <Button disabled={upgrading} onClick={handleUpgradePro}>
                  {upgrading ? '…' : 'Actualizar a Pro (demo)'}
                </Button>
                <Link
                  to="/subscription"
                  className="flex w-full items-center justify-center rounded-xl border border-white/10 py-3 text-sm font-semibold text-white hover:border-[#22c55e]/40"
                >
                  Ver suscripción y Stripe
                </Link>
              </div>
            </ModalPanel>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
