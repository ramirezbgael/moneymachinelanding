import { useCallback, useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Lock } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import { useRequireStores, useDashboardWorkspace } from '../../context/DashboardWorkspaceContext'
import { normalizeModulesEnabled } from '../../lib/workspace'
import { Card, PageHeader, Spinner } from '../../components/dashboard/ui'
import ProUpgradeModal from '../../components/ProUpgradeModal'
import { Link } from 'react-router-dom'

const MODULES = [
  {
    key: 'inventory',
    title: 'Inventario',
    desc: 'Control de stock y alertas de producto.',
  },
  {
    key: 'reports',
    title: 'Reportes',
    desc: 'Exportaciones y análisis de ventas.',
  },
  {
    key: 'multi_store',
    title: 'Multi-tienda',
    desc: 'Opera varias sucursales con reglas centralizadas.',
  },
]

export default function ModulesPage() {
  useRequireStores()
  const { primaryBusiness, isPro, refresh } = useDashboardWorkspace()
  const biz = primaryBusiness
  const [modules, setModules] = useState(normalizeModulesEnabled(biz?.modules_enabled))
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [upgradeModalOpen, setUpgradeModalOpen] = useState(false)

  useEffect(() => {
    setModules(normalizeModulesEnabled(biz?.modules_enabled))
  }, [biz?.id, biz?.modules_enabled])

  const persist = useCallback(
    async (next) => {
      if (!biz?.id || !isPro) return
      setSaving(true)
      setError('')
      try {
        const { error: uErr } = await supabase
          .from('businesses')
          .update({ modules_enabled: next })
          .eq('id', biz.id)
        if (uErr) throw uErr
        await refresh()
      } catch (e) {
        if (import.meta.env.DEV) console.error(e)
        setError('No se pudo guardar. Verifica columnas en Supabase (migration_007).')
      } finally {
        setSaving(false)
      }
    },
    [biz?.id, isPro, refresh],
  )

  function toggle(key) {
    if (!isPro) {
      setUpgradeModalOpen(true)
      return
    }
    const next = { ...modules, [key]: !modules[key] }
    setModules(next)
    persist(next)
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <PageHeader
        title="Módulos"
        subtitle="Activa funcionalidades por tienda. En plan Gratis algunos módulos están bloqueados."
      />

      {!isPro ? (
        <Card className="mb-6 border-[#22c55e]/20 bg-[#22c55e]/5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="font-semibold text-[#bbf7d0]">Plan Gratis</p>
              <p className="mt-1 text-sm text-[#94a3b8]">
                Pásate a Pro para activar inventario, reportes y multi-tienda.
              </p>
            </div>
            <Link
              to="/subscription"
              className="inline-flex items-center justify-center rounded-xl bg-[#22c55e] px-4 py-2.5 text-sm font-semibold text-[#052e16] hover:bg-[#4ade80]"
            >
              Mejorar plan
            </Link>
          </div>
        </Card>
      ) : null}

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {MODULES.map((m) => {
          const on = Boolean(modules[m.key])
          const locked = !isPro
          return (
            <Card key={m.key} className={locked ? 'relative overflow-hidden' : ''}>
              {locked ? (
                <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-[2px]">
                  <div className="flex items-center gap-2 rounded-full border border-white/10 bg-[#0c1016] px-3 py-1.5 text-xs font-medium text-[#94a3b8]">
                    <Lock className="h-3.5 w-3.5" />
                    Solo Pro
                  </div>
                </div>
              ) : null}
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="text-lg font-semibold text-white">{m.title}</h3>
                  <p className="mt-1 text-sm text-[#94a3b8]">{m.desc}</p>
                </div>
                <button
                  type="button"
                  disabled={locked || saving}
                  role="switch"
                  aria-checked={on}
                  onClick={() => toggle(m.key)}
                  className={`relative h-7 w-12 shrink-0 rounded-full transition-colors ${
                    on ? 'bg-[#22c55e]' : 'bg-[#334155]'
                  } ${locked ? 'opacity-50' : ''}`}
                >
                  <span
                    className={`absolute top-0.5 h-6 w-6 rounded-full bg-white shadow transition-transform ${
                      on ? 'left-5' : 'left-0.5'
                    }`}
                  />
                </button>
              </div>
            </Card>
          )
        })}
      </div>

      {error ? <p className="mt-4 text-sm text-red-300">{error}</p> : null}
      {saving ? (
        <p className="mt-2 flex items-center gap-2 text-sm text-[#64748b]">
          <Spinner className="!h-4 !w-4" /> Guardando…
        </p>
      ) : null}

      <ProUpgradeModal
        open={upgradeModalOpen}
        onClose={() => setUpgradeModalOpen(false)}
        title="Mejora a Pro"
        description="Activa inventario, reportes y multi-tienda con el plan Pro."
      />
    </motion.div>
  )
}
