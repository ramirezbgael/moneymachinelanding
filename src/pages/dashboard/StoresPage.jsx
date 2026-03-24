import { useState } from 'react'
import { motion } from 'framer-motion'
import { ExternalLink, Plus } from 'lucide-react'
import { getOnboardingErrorMessage } from '../../lib/onboardingErrors'
import { createBusinessAndMembership } from '../../lib/supabase'
import { useVerificationGate } from '../../context/VerificationGateContext'
import { useRequireStores, useDashboardWorkspace } from '../../context/DashboardWorkspaceContext'
import { getPosUrl } from '../../lib/workspace'
import { Button, Card, Input, Label, PageHeader, Select, Spinner } from '../../components/dashboard/ui'
import { ModalPanel } from '../../components/Modal'

const TYPES = [
  { value: 'store', label: 'Tienda / retail' },
  { value: 'restaurant', label: 'Restaurante' },
  { value: 'services', label: 'Servicios' },
  { value: 'other', label: 'Otro' },
]

export default function StoresPage() {
  useRequireStores()
  const { stores, refresh } = useDashboardWorkspace()
  const { ensureVerified } = useVerificationGate()
  const [modal, setModal] = useState(false)
  const [name, setName] = useState('')
  const [type, setType] = useState('store')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  async function handleCreate(e) {
    e.preventDefault()
    setError('')
    if (!name.trim()) return
    setSubmitting(true)
    try {
      const ok = await ensureVerified()
      if (!ok) return
      const { error: rpcErr } = await createBusinessAndMembership(name.trim(), type)
      if (rpcErr) throw rpcErr
      setModal(false)
      setName('')
      setType('store')
      await refresh()
    } catch (err) {
      if (import.meta.env.DEV) console.error(err)
      setError(getOnboardingErrorMessage(err))
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <PageHeader
        title="Tiendas"
        subtitle="Cada tienda tiene su propio POS. Abre el terminal o crea una nueva ubicación."
        action={
          <Button onClick={() => setModal(true)}>
            <Plus className="h-4 w-4" />
            Crear tienda
          </Button>
        }
      />

      {stores.length === 0 ? (
        <Card>
          <p className="text-[#94a3b8]">No hay tiendas todavía.</p>
          <Button className="mt-4" onClick={() => setModal(true)}>
            Crear la primera
          </Button>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {stores.map((s) => (
            <Card key={s.id}>
              <h3 className="text-lg font-semibold text-white">{s.name}</h3>
              <p className="mt-1 text-sm capitalize text-[#64748b]">{s.type}</p>
              <p className="mt-2 font-mono text-xs text-[#475569]">{s.id}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                <a
                  href={getPosUrl(s.id)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#22c55e] px-4 py-2.5 text-sm font-semibold text-[#052e16] hover:bg-[#4ade80] min-[360px]:flex-none"
                >
                  Abrir POS
                  <ExternalLink className="h-4 w-4" />
                </a>
              </div>
            </Card>
          ))}
        </div>
      )}

      {modal ? (
        <div
          className="fixed inset-0 z-[120] flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm"
          role="presentation"
          onClick={() => !submitting && setModal(false)}
        >
          <div onClick={(e) => e.stopPropagation()}>
            <ModalPanel>
              <h2 className="text-lg font-semibold text-white">Nueva tienda</h2>
              <p className="mt-1 text-sm text-[#94a3b8]">Se creará un negocio y tu usuario quedará como propietario.</p>
              <form onSubmit={handleCreate} className="mt-6 space-y-4">
                <div>
                  <Label>Nombre</Label>
                  <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Ej. Sucursal Centro" required />
                </div>
                <div>
                  <Label>Tipo</Label>
                  <Select value={type} onChange={(e) => setType(e.target.value)}>
                    {TYPES.map((t) => (
                      <option key={t.value} value={t.value}>
                        {t.label}
                      </option>
                    ))}
                  </Select>
                </div>
                {error ? <p className="text-sm text-red-300">{error}</p> : null}
                <div className="flex gap-2 pt-2">
                  <Button type="submit" disabled={submitting} className="flex-1">
                    {submitting ? <Spinner className="!h-5 !w-5" /> : 'Crear'}
                  </Button>
                  <Button type="button" variant="secondary" disabled={submitting} onClick={() => setModal(false)}>
                    Cancelar
                  </Button>
                </div>
              </form>
            </ModalPanel>
          </div>
        </div>
      ) : null}
    </motion.div>
  )
}
