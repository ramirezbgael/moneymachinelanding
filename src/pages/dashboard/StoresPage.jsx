import { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { MapPin } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import { useRequireStores, useDashboardWorkspace } from '../../context/DashboardWorkspaceContext'
import { Button, Card, Input, Label, PageHeader, Select, Spinner } from '../../components/dashboard/ui'

export default function StoresPage() {
  useRequireStores()
  const { primaryBusiness } = useDashboardWorkspace()
  const [registers, setRegisters] = useState([])
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState('')
  const [locationName, setLocationName] = useState('')
  const [registerName, setRegisterName] = useState('Caja principal')
  const [creating, setCreating] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!primaryBusiness?.id) return
    let cancelled = false
    setLoading(true)
    setLoadError('')
    ;(async () => {
      const { data, error } = await supabase
        .from('registers')
        .select('id, name, location, created_at')
        .eq('business_id', primaryBusiness.id)
        .order('created_at', { ascending: true })
      if (cancelled) return
      if (error) {
        setLoadError('No se pudieron cargar las sucursales.')
        setRegisters([])
      } else {
        setRegisters(data ?? [])
      }
      setLoading(false)
    })()
    return () => {
      cancelled = true
    }
  }, [primaryBusiness?.id, creating])

  const branches = useMemo(() => {
    const map = new Map()
    for (const reg of registers) {
      const key = (reg.location || reg.name || 'Sin ubicación').trim()
      const current = map.get(key) ?? { label: key, count: 0 }
      current.count += 1
      map.set(key, current)
    }
    return [...map.values()]
  }, [registers])

  async function handleAddLocation(e) {
    e.preventDefault()
    setError('')
    if (!locationName.trim()) return
    setSubmitting(true)
    try {
      setCreating(true)
      const { error } = await supabase.from('registers').insert({
        business_id: primaryBusiness.id,
        name: registerName.trim() || 'Caja principal',
        location: locationName.trim(),
      })
      if (error) throw error
      setLocationName('')
      setRegisterName('Caja principal')
    } catch (err) {
      setError('No se pudo crear la sucursal.')
    } finally {
      setSubmitting(false)
      setCreating(false)
    }
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <PageHeader
        title="Locations / Sucursales"
        subtitle="Las sucursales pertenecen al negocio activo. Los negocios se crean desde el selector superior."
      />

      <Card>
        <h3 className="text-sm font-semibold text-white">Agregar sucursal</h3>
        <form onSubmit={handleAddLocation} className="mt-4 grid gap-3 md:grid-cols-[1fr_1fr_auto]">
          <div>
            <Label>Nombre de sucursal</Label>
            <Input value={locationName} onChange={(e) => setLocationName(e.target.value)} placeholder="Ej. Centro" required />
          </div>
          <div>
            <Label>Nombre de registro</Label>
            <Input value={registerName} onChange={(e) => setRegisterName(e.target.value)} placeholder="Caja principal" />
          </div>
          <div className="md:self-end">
            <Button type="submit" disabled={submitting}>
              {submitting ? <Spinner className="!h-5 !w-5" /> : 'Agregar sucursal'}
            </Button>
          </div>
        </form>
        {error ? <p className="mt-3 text-sm text-red-300">{error}</p> : null}
      </Card>

      <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {loading ? (
          <Card>
            <p className="text-sm text-[#94a3b8]">Cargando sucursales...</p>
          </Card>
        ) : null}
        {!loading && loadError ? (
          <Card>
            <p className="text-sm text-red-300">{loadError}</p>
          </Card>
        ) : null}
        {!loading && !loadError && branches.length === 0 ? (
          <Card>
            <p className="text-sm text-[#94a3b8]">Aún no hay sucursales para este negocio.</p>
          </Card>
        ) : null}
        {branches.map((branch) => (
          <Card key={branch.label}>
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-[#94a3b8]" />
              <h3 className="text-lg font-semibold text-white">{branch.label}</h3>
            </div>
            <p className="mt-2 text-sm text-[#94a3b8]">{branch.count} registro(s)</p>
          </Card>
        ))}
      </div>
    </motion.div>
  )
}
