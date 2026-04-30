import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.1'
import { Resend } from 'npm:resend'

const corsHeaders: Record<string, string> = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Max-Age': '86400',
}

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  })
}

function normalizeRole(raw: unknown) {
  const value = String(raw ?? '').trim().toLowerCase()
  if (value === 'admin') return 'admin'
  return 'cashier'
}

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')
    const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
    const resendApiKey = Deno.env.get('RESEND_API_KEY')
    const fromEmail = Deno.env.get('INVITE_FROM_EMAIL') || 'onboarding@moneymachine.com.mx'
    const appBaseUrl = Deno.env.get('APP_BASE_URL') || req.headers.get('origin') || ''

    if (!supabaseUrl || !serviceKey) {
      return json({ error: 'Missing Supabase runtime secrets' }, 500)
    }
    if (!resendApiKey) {
      return json({ error: 'RESEND_API_KEY no configurada' }, 500)
    }
    const resend = new Resend(resendApiKey)

    const authHeader = req.headers.get('Authorization')
    const token = authHeader?.replace(/^Bearer\s+/i, '')?.trim()
    if (!token) return json({ error: 'Authorization Bearer requerido' }, 401)

    const body = await req.json().catch(() => ({}))
    const businessId = String(body.businessId ?? '').trim()
    const email = String(body.email ?? '').trim().toLowerCase()
    const role = normalizeRole(body.role)

    if (!businessId) return json({ error: 'businessId requerido' }, 400)
    if (!email || !email.includes('@')) return json({ error: 'email inválido' }, 400)

    const supabase = createClient(supabaseUrl, serviceKey)
    const {
      data: { user },
      error: userErr,
    } = await supabase.auth.getUser(token)
    if (userErr || !user?.id) return json({ error: 'Sesión inválida o expirada' }, 401)

    const { data: business, error: businessErr } = await supabase
      .from('businesses')
      .select('id, name, type, user_id')
      .eq('id', businessId)
      .maybeSingle()
    if (businessErr || !business) return json({ error: 'Negocio no encontrado' }, 404)

    const { data: manager } = await supabase
      .from('business_members')
      .select('id, role')
      .eq('business_id', businessId)
      .eq('user_id', user.id)
      .in('role', ['owner', 'admin'])
      .maybeSingle()

    const canInvite = business.user_id === user.id || Boolean(manager)
    if (!canInvite) return json({ error: 'Sin permisos para invitar en este negocio' }, 403)

    const { data: existingInvite } = await supabase
      .from('business_invites')
      .select('id')
      .eq('business_id', businessId)
      .eq('email', email)
      .maybeSingle()
    if (existingInvite) {
      return json({ error: 'duplicate_invite', message: 'Ese email ya tiene invitación pendiente.' }, 409)
    }

    const { error: insertErr } = await supabase.from('business_invites').insert({
      business_id: businessId,
      email,
      role,
      invited_by: user.id,
    })
    if (insertErr) return json({ error: insertErr.message }, 400)

    const inviteUrl = `${appBaseUrl}/register`
    const roleLabel = role === 'admin' ? 'Administrador' : 'Cajero'
    const businessName = business.name || 'tu negocio'

    const { error: resendErr } = await resend.emails.send({
      from: fromEmail,
      to: email,
      subject: `Invitación a ${businessName} en MoneyMachine`,
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.5; color: #111827;">
          <h2>Te invitaron a ${businessName}</h2>
          <p>Rol asignado: <strong>${roleLabel}</strong></p>
          <p>Para unirte, regístrate con este mismo correo.</p>
          <p><a href="${inviteUrl}" style="display:inline-block;padding:10px 14px;background:#22c55e;color:#052e16;text-decoration:none;border-radius:8px;font-weight:600;">Crear cuenta</a></p>
          <p style="font-size:12px;color:#6b7280;">Si ya tienes cuenta, inicia sesión con este correo y verás la invitación.</p>
        </div>
      `,
    })

    if (resendErr) {
      console.error('resend error', resendErr)
      return json(
        { error: 'invite_saved_but_email_failed', message: 'Invitación guardada, pero falló el envío de correo.' },
        502,
      )
    }

    return json({ ok: true })
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e)
    console.error(e)
    return json({ error: msg }, 500)
  }
})

