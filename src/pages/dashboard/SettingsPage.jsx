import { useCallback, useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { ImagePlus, Trash2 } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import { useRequireStores, useDashboardWorkspace } from '../../context/DashboardWorkspaceContext'
import { Button, Card, Input, Label, PageHeader, Spinner } from '../../components/dashboard/ui'
import { useAuth } from '../../hooks/useAuth'
import { getAuthEmail } from '../../lib/authUtils'

export default function SettingsPage() {
  useRequireStores()
  const { primaryBusiness, refresh, profile } = useDashboardWorkspace()
  const { user, refreshSession, signOut } = useAuth()
  const biz = primaryBusiness
  const [accountName, setAccountName] = useState(profile?.name ?? '')
  const [accountEmail, setAccountEmail] = useState(getAuthEmail(user) || profile?.email || '')
  const [updatingAccount, setUpdatingAccount] = useState(false)
  const [accountMessage, setAccountMessage] = useState('')
  const [name, setName] = useState('')
  const [themeColor, setThemeColor] = useState('#22c55e')
  const [logoUrl, setLogoUrl] = useState('')
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    if (!biz) return
    setName(biz.name ?? '')
    setThemeColor(biz.theme_color || '#22c55e')
    setLogoUrl(biz.logo_url || '')
  }, [biz])

  useEffect(() => {
    setAccountName(profile?.name ?? '')
    setAccountEmail(getAuthEmail(user) || profile?.email || '')
  }, [profile, user])

  const saveAccount = useCallback(async () => {
    setUpdatingAccount(true)
    setAccountMessage('')
    try {
      // Actualizar nombre en profiles
      if (profile?.id) {
        const { error: pErr } = await supabase
          .from('profiles')
          .update({ name: accountName.trim() || null })
          .eq('id', profile.id)
        if (pErr) throw pErr
      }

      // Actualizar email en auth (dispara correo de confirmación)
      const trimmedEmail = accountEmail.trim()
      if (trimmedEmail && trimmedEmail !== getAuthEmail(user)) {
        const { error: eErr } = await supabase.auth.updateUser({ email: trimmedEmail })
        if (eErr) throw eErr
      }

      await refreshSession()
      await refresh()
      setAccountMessage(
        'Datos de cuenta actualizados. Si cambiaste el correo, revisa tu bandeja para confirmar el nuevo email.',
      )
    } catch (e) {
      if (import.meta.env.DEV) console.error(e)
      setAccountMessage('No se pudieron actualizar los datos de cuenta. Intenta de nuevo.')
    } finally {
      setUpdatingAccount(false)
    }
  }, [accountName, accountEmail, profile?.id, user, refreshSession, refresh])

  const saveBusiness = useCallback(async () => {
    if (!biz?.id) return
    setSaving(true)
    setMessage('')
    try {
      const { error } = await supabase
        .from('businesses')
        .update({
          name: name.trim(),
          theme_color: themeColor,
          logo_url: logoUrl || null,
        })
        .eq('id', biz.id)
      if (error) throw error
      setMessage('Guardado correctamente.')
      await refresh()
    } catch (e) {
      if (import.meta.env.DEV) console.error(e)
      setMessage('No se pudo guardar. Revisa permisos RLS y migration_007.')
    } finally {
      setSaving(false)
    }
  }, [biz?.id, name, themeColor, logoUrl, refresh])

  async function onLogoFile(e) {
    const file = e.target.files?.[0]
    if (!file || !biz?.id) return
    setUploading(true)
    setMessage('')
    try {
      const ext = file.name.split('.').pop() || 'png'
      const path = `${biz.id}/logo-${Date.now()}.${ext}`
      const { error: upErr } = await supabase.storage.from('business-logos').upload(path, file, {
        upsert: true,
      })
      if (upErr) throw upErr
      const { data } = supabase.storage.from('business-logos').getPublicUrl(path)
      setLogoUrl(data.publicUrl)
      const { error: uErr } = await supabase.from('businesses').update({ logo_url: data.publicUrl }).eq('id', biz.id)
      if (uErr) throw uErr
      setMessage('Logo actualizado.')
      await refresh()
    } catch (err) {
      if (import.meta.env.DEV) console.error(err)
      setMessage('Error al subir. ¿Existe el bucket business-logos? (migration_007)')
    } finally {
      setUploading(false)
      e.target.value = ''
    }
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <PageHeader
        title="Cuenta"
        subtitle="Configura tus datos de cuenta y el nombre/branding de tu negocio."
      />

      <div className="max-w-xl space-y-6">
        <Card>
          <h3 className="text-sm font-semibold text-white">Datos de cuenta</h3>
          <div className="mt-4 space-y-4">
            <div>
              <Label>Nombre</Label>
              <Input value={accountName} onChange={(e) => setAccountName(e.target.value)} />
            </div>
            <div>
              <Label>Correo de acceso</Label>
              <Input
                type="email"
                value={accountEmail}
                onChange={(e) => setAccountEmail(e.target.value)}
                placeholder="tucorreo@ejemplo.com"
              />
              <p className="mt-1 text-xs text-[#64748b]">
                Si cambias el correo, te enviaremos un email de confirmación. El nuevo correo no será definitivo hasta que lo confirmes.
              </p>
            </div>
          </div>
          <div className="mt-4 flex items-center gap-2">
            <Button disabled={updatingAccount} onClick={saveAccount}>
              {updatingAccount ? <Spinner className="!h-5 !w-5" /> : 'Guardar cuenta'}
            </Button>
            {accountMessage ? <p className="text-xs text-[#86efac]">{accountMessage}</p> : null}
          </div>
        </Card>

        <Card>
          <h3 className="text-sm font-semibold text-white">Negocio</h3>
          <div className="mt-4 space-y-4">
            <div>
              <Label>Nombre del negocio</Label>
              <Input value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div>
              <Label>Color de tema</Label>
              <div className="mt-2 flex items-center gap-3">
                <input
                  type="color"
                  value={themeColor}
                  onChange={(e) => setThemeColor(e.target.value)}
                  className="h-10 w-14 cursor-pointer rounded-lg border border-white/10 bg-transparent"
                />
                <Input value={themeColor} onChange={(e) => setThemeColor(e.target.value)} className="font-mono text-xs" />
              </div>
            </div>
          </div>
        </Card>

        <Card>
          <h3 className="text-sm font-semibold text-white">Logo</h3>
          <p className="mt-1 text-xs text-[#64748b]">PNG o JPG. Se sirve desde Storage público.</p>
          {logoUrl ? (
            <img src={logoUrl} alt="" className="mt-4 h-20 w-auto max-w-full rounded-lg border border-white/10 object-contain" />
          ) : null}
          <label className="mt-4 inline-flex cursor-pointer items-center gap-2 rounded-xl border border-dashed border-white/15 px-4 py-3 text-sm text-[#94a3b8] hover:border-[#22c55e]/40">
            <ImagePlus className="h-4 w-4" />
            {uploading ? 'Subiendo…' : 'Subir imagen'}
            <input type="file" accept="image/*" className="hidden" onChange={onLogoFile} disabled={uploading} />
          </label>
        </Card>

        {message ? <p className="text-sm text-[#86efac]">{message}</p> : null}

        <Button disabled={saving || !biz} onClick={saveBusiness}>
          {saving ? <Spinner className="!h-5 !w-5" /> : 'Guardar cambios'}
        </Button>

        <Card>
          <h3 className="text-sm font-semibold text-white">Eliminar cuenta</h3>
          <p className="mt-2 text-xs text-[#f97373]">
            Esta acción requiere una función de servidor para borrar tu usuario de forma segura. Por ahora, si necesitas eliminar tu cuenta,
            cierra sesión y contáctanos desde el formulario de soporte.
          </p>
          <div className="mt-3">
            <Button
              variant="secondary"
              className="border-red-500/40 text-red-200 hover:border-red-400 hover:text-red-100"
              onClick={() => signOut()}
            >
              <Trash2 className="h-4 w-4" />
              Cerrar sesión
            </Button>
          </div>
        </Card>
      </div>
    </motion.div>
  )
}
