import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ExternalLink, Pencil, Sparkles } from 'lucide-react'
import { useState } from 'react'
import { useDashboardWorkspace } from '../../context/DashboardWorkspaceContext'
import { Card, PageHeader, Button, Input } from '../../components/dashboard/ui'
import { supabase } from '../../lib/supabase'

export default function DashboardHomePage() {
  const { profile, stores, planLabel, isPro, refresh } = useDashboardWorkspace()
  const store = stores[0] ?? null
  const [editingName, setEditingName] = useState(false)
  const [name, setName] = useState(store?.name ?? '')
  const [savingName, setSavingName] = useState(false)

  async function handleSaveName() {
    if (!store?.id || !name.trim()) return
    setSavingName(true)
    try {
      const { error } = await supabase
        .from('businesses')
        .update({ name: name.trim() })
        .eq('id', store.id)
      if (!error) {
        setEditingName(false)
        await refresh()
      }
    } finally {
      setSavingName(false)
    }
  }

  const accountLabel =
    profile?.email || profile?.name || 'Tu cuenta'

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <PageHeader
        title="Tu panel de MoneyMachine"
        subtitle="Administra tu cuenta, suscripción y abre tu punto de venta desde un solo lugar."
      />

      <div className="grid gap-4 lg:grid-cols-3">
        {/* Cuenta / negocio */}
        <Card className="lg:col-span-1">
          <p className="text-xs font-medium uppercase tracking-wider text-[#64748b]">Cuenta</p>
          <p className="mt-2 text-sm text-[#94a3b8]">{accountLabel}</p>
          <div className="mt-4 space-y-3">
            <p className="text-xs font-medium uppercase tracking-wider text-[#64748b]">
              Nombre del negocio
            </p>
            <div className="flex flex-col gap-2 sm:flex-row">
              <Input
                value={editingName ? name : store?.name ?? ''}
                onChange={(e) => setName(e.target.value)}
                disabled={!editingName}
                placeholder="Sin nombre aún"
              />
              <Button
                variant="secondary"
                className="shrink-0"
                disabled={savingName}
                onClick={() => (editingName ? handleSaveName() : setEditingName(true))}
              >
                <Pencil className="h-4 w-4" />
                {editingName ? (savingName ? 'Guardando…' : 'Guardar') : 'Editar'}
              </Button>
            </div>
          </div>
        </Card>

        {/* Suscripción */}
        <Card className="lg:col-span-1">
          <p className="text-xs font-medium uppercase tracking-wider text-[#64748b]">Suscripción</p>
          <p className="mt-2 text-2xl font-semibold text-white">{planLabel}</p>
          <p className="mt-1 text-sm text-[#94a3b8]">
            {isPro
              ? 'Tu plan está activo. Puedes gestionar la facturación desde la sección de suscripción.'
              : 'Mejora a Pro para desbloquear todo el potencial de MoneyMachine.'}
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <Link to="/subscription">
              <Button>
                {isPro ? 'Ver detalles de suscripción' : 'Mejorar a Pro'}
              </Button>
            </Link>
          </div>
        </Card>

        {/* POS */}
        <Card className="lg:col-span-1">
          <p className="text-xs font-medium uppercase tracking-wider text-[#64748b]">Punto de venta</p>
          <div className="mt-3 flex items-center gap-2 text-[#86efac]">
            <Sparkles className="h-5 w-5" />
            <span className="text-sm font-medium">
              {store ? 'Todo listo para vender' : 'Crea tu tienda para empezar a vender'}
            </span>
          </div>
          <p className="mt-2 text-sm text-[#94a3b8]">
            Usa la misma cuenta en varios dispositivos; tu tienda y su inventario son los mismos.
          </p>
          {store ? (
            <a
              href="https://moneymachinepos.netlify.app"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-flex items-center gap-2 rounded-xl bg-[#22c55e] px-4 py-2.5 text-sm font-semibold text-[#052e16] shadow-[0_0_24px_rgba(34,197,94,0.25)] hover:bg-[#4ade80]"
            >
              Abrir POS
              <ExternalLink className="h-4 w-4" />
            </a>
          ) : null}
        </Card>
      </div>
    </motion.div>
  )
}
