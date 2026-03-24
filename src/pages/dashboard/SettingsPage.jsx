import { useCallback, useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { ImagePlus } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import { useRequireStores, useDashboardWorkspace } from '../../context/DashboardWorkspaceContext'
import { Button, Card, Input, Label, PageHeader, Spinner } from '../../components/dashboard/ui'

export default function SettingsPage() {
  useRequireStores()
  const { primaryBusiness, refresh } = useDashboardWorkspace()
  const biz = primaryBusiness
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
        title="Ajustes"
        subtitle="Nombre del negocio, marca y color de acento para la consola."
      />

      <div className="max-w-xl space-y-6">
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
      </div>
    </motion.div>
  )
}
