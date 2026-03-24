import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Plus, Sparkles, Store } from 'lucide-react'
import { useRequireStores, useDashboardWorkspace } from '../../context/DashboardWorkspaceContext'
import { Card, PageHeader } from '../../components/dashboard/ui'

export default function DashboardHomePage() {
  useRequireStores()
  const { profile, stores, planLabel, isPro } = useDashboardWorkspace()
  const name = profile?.name?.trim() || profile?.email?.split('@')[0] || 'equipo'

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <PageHeader
        title={`Hola, ${name}`}
        subtitle="Resumen de tu cuenta MoneyMachine. Gestiona tiendas, equipo y suscripción desde aquí."
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Card>
          <p className="text-xs font-medium uppercase tracking-wider text-[#64748b]">Plan actual</p>
          <p className="mt-2 text-2xl font-semibold text-white">{planLabel}</p>
          <p className="mt-1 text-sm text-[#94a3b8]">
            {isPro ? 'Tienes acceso a módulos avanzados.' : 'Mejora a Pro para desbloquear todo el potencial.'}
          </p>
          {!isPro ? (
            <Link
              to="/subscription"
              className="mt-4 inline-flex text-sm font-medium text-[#22c55e] hover:underline"
            >
              Ver planes →
            </Link>
          ) : null}
        </Card>

        <Card>
          <p className="text-xs font-medium uppercase tracking-wider text-[#64748b]">Tiendas</p>
          <p className="mt-2 text-2xl font-semibold text-white">{stores.length}</p>
          <p className="mt-1 text-sm text-[#94a3b8]">Puntos de venta conectados a tu cuenta.</p>
          <Link
            to="/stores"
            className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-[#22c55e] hover:underline"
          >
            <Store className="h-4 w-4" />
            Gestionar tiendas
          </Link>
        </Card>

        <Card className="sm:col-span-2 lg:col-span-1">
          <p className="text-xs font-medium uppercase tracking-wider text-[#64748b]">Estado</p>
          <div className="mt-3 flex items-center gap-2 text-[#86efac]">
            <Sparkles className="h-5 w-5" />
            <span className="text-sm font-medium">Todo listo para vender</span>
          </div>
          <p className="mt-2 text-sm text-[#94a3b8]">Abre el POS de cualquier tienda en un clic.</p>
        </Card>
      </div>

      <h2 className="mb-4 mt-10 text-lg font-semibold text-white">Acciones rápidas</h2>
      <div className="flex flex-wrap gap-3">
        <Link
          to="/stores"
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#22c55e] px-4 py-2.5 text-sm font-semibold text-[#052e16] shadow-[0_0_24px_rgba(34,197,94,0.25)] hover:bg-[#4ade80]"
        >
          <Plus className="h-4 w-4" />
          Crear tienda
        </Link>
        <Link
          to="/subscription"
          className="inline-flex items-center justify-center rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-semibold text-[#e2e8f0] hover:border-[#22c55e]/40"
        >
          Gestionar suscripción
        </Link>
        <Link
          to="/modules"
          className="inline-flex items-center justify-center rounded-xl px-4 py-2.5 text-sm font-semibold text-[#94a3b8] hover:bg-white/5 hover:text-white"
        >
          Configurar módulos
        </Link>
      </div>
    </motion.div>
  )
}
