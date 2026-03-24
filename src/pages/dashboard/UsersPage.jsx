import { useCallback, useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Mail, Trash2, UserPlus } from 'lucide-react'
import { useAuth } from '../../hooks/useAuth'
import { useRequireStores, useDashboardWorkspace } from '../../context/DashboardWorkspaceContext'
import {
  createBusinessInvite,
  deleteBusinessInvite,
  fetchTeamForBusiness,
} from '../../lib/workspace'
import { Button, Card, Input, Label, PageHeader, Select, Spinner } from '../../components/dashboard/ui'

const ROLES = [
  { value: 'admin', label: 'Administrador' },
  { value: 'cashier', label: 'Cajero' },
]

export default function UsersPage() {
  useRequireStores()
  const { user } = useAuth()
  const { primaryBusiness, stores, setPrimaryBusinessId } = useDashboardWorkspace()
  const bizId = primaryBusiness?.id
  const [members, setMembers] = useState([])
  const [invites, setInvites] = useState([])
  const [loading, setLoading] = useState(true)
  const [email, setEmail] = useState('')
  const [role, setRole] = useState('cashier')
  const [submitting, setSubmitting] = useState(false)
  const [msg, setMsg] = useState('')

  const load = useCallback(async () => {
    if (!bizId) {
      setMembers([])
      setInvites([])
      setLoading(false)
      return
    }
    setLoading(true)
    const { members: m, invites: i, error } = await fetchTeamForBusiness(bizId)
    if (error) {
      if (import.meta.env.DEV) console.error(error)
      setMsg('No se pudo cargar el equipo. ¿Ejecutaste migration_007 en Supabase?')
      setMembers([])
      setInvites([])
    } else {
      setMsg('')
      setMembers(m)
      setInvites(i)
    }
    setLoading(false)
  }, [bizId])

  useEffect(() => {
    load()
  }, [load])

  async function handleInvite(e) {
    e.preventDefault()
    if (!bizId || !user?.id || !email.trim()) return
    setSubmitting(true)
    setMsg('')
    try {
      const { error } = await createBusinessInvite({
        businessId: bizId,
        email: email.trim(),
        role,
        invitedBy: user.id,
      })
      if (error) throw error
      setEmail('')
      await load()
    } catch (err) {
      if (import.meta.env.DEV) console.error(err)
      setMsg(err?.message?.includes('duplicate') ? 'Ese email ya tiene invitación pendiente.' : 'No se pudo crear la invitación.')
    } finally {
      setSubmitting(false)
    }
  }

  async function handleDeleteInvite(id) {
    const { error } = await deleteBusinessInvite(id)
    if (error) {
      if (import.meta.env.DEV) console.error(error)
      return
    }
    await load()
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <PageHeader
        title="Usuarios"
        subtitle="Miembros activos e invitaciones pendientes para la tienda seleccionada."
      />

      {stores.length > 1 ? (
        <Card className="mb-6">
          <Label>Tienda</Label>
          <Select
            className="mt-2 max-w-md"
            value={bizId ?? ''}
            onChange={(e) => setPrimaryBusinessId(e.target.value)}
          >
            {stores.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </Select>
        </Card>
      ) : null}

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <h3 className="text-sm font-semibold text-white">Añadir usuario</h3>
          <p className="mt-1 text-xs text-[#64748b]">
            Guardamos la invitación por email. El usuario deberá registrarse con ese correo para unirse (flujo
            completo próximamente).
          </p>
          <form onSubmit={handleInvite} className="mt-4 space-y-3">
            <div>
              <Label>Email</Label>
              <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="nombre@empresa.com" required />
            </div>
            <div>
              <Label>Rol</Label>
              <Select value={role} onChange={(e) => setRole(e.target.value)}>
                {ROLES.map((r) => (
                  <option key={r.value} value={r.value}>
                    {r.label}
                  </option>
                ))}
              </Select>
            </div>
            {msg ? <p className="text-sm text-amber-200/90">{msg}</p> : null}
            <Button type="submit" disabled={submitting || !bizId}>
              {submitting ? <Spinner className="!h-5 !w-5" /> : (
                <>
                  <UserPlus className="h-4 w-4" />
                  Añadir
                </>
              )}
            </Button>
          </form>
        </Card>

        <Card>
          <h3 className="text-sm font-semibold text-white">Invitaciones pendientes</h3>
          {loading ? (
            <div className="mt-6 flex justify-center py-8">
              <Spinner />
            </div>
          ) : invites.length === 0 ? (
            <p className="mt-4 text-sm text-[#64748b]">No hay invitaciones.</p>
          ) : (
            <ul className="mt-4 space-y-2">
              {invites.map((inv) => (
                <li
                  key={inv.id}
                  className="flex items-center justify-between gap-2 rounded-xl border border-white/5 bg-black/20 px-3 py-2 text-sm"
                >
                  <span className="flex items-center gap-2 truncate text-[#e2e8f0]">
                    <Mail className="h-4 w-4 shrink-0 text-[#64748b]" />
                    <span className="truncate">{inv.email}</span>
                    <span className="shrink-0 text-xs text-[#22c55e]">({inv.role})</span>
                  </span>
                  <button
                    type="button"
                    className="shrink-0 rounded-lg p-2 text-[#64748b] hover:bg-white/5 hover:text-red-300"
                    aria-label="Eliminar invitación"
                    onClick={() => handleDeleteInvite(inv.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>

      <h3 className="mb-3 mt-10 text-sm font-semibold text-white">Miembros activos</h3>
      {loading ? (
        <div className="flex justify-center py-12">
          <Spinner />
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2">
          {members.map((m) => (
            <Card key={m.id} className="!p-4">
              <p className="font-medium text-white">{m.profile?.name || 'Usuario'}</p>
              <p className="truncate text-sm text-[#94a3b8]">{m.profile?.email || m.user_id}</p>
              <p className="mt-2 text-xs uppercase tracking-wider text-[#22c55e]">{m.role}</p>
            </Card>
          ))}
        </div>
      )}
    </motion.div>
  )
}
