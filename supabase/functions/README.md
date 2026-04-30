# Edge Functions

## `create-checkout-session`

Crea una sesión de [Stripe Checkout](https://stripe.com/docs/payments/checkout). Requiere **JWT de usuario** (`Authorization: Bearer <access_token>`). Usa **service role** solo en el servidor para `auth.getUser(token)` y comprobar suscripciones activas.

**Secrets que sí configuras tú:** `STRIPE_SECRET_KEY`.  
**Automáticas en el runtime:** `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY` (no uses `supabase secrets set` con prefijo `SUPABASE_` — la CLI lo rechaza).

```bash
supabase secrets set STRIPE_SECRET_KEY=sk_test_xxx
supabase functions deploy create-checkout-session --no-verify-jwt
```

## `create-billing-portal-session`

Abre el [Customer Portal](https://stripe.com/docs/customer-management) de Stripe para el `stripe_customer_id` guardado en `public.subscriptions`. Activa el portal en **Stripe Dashboard → Settings → Billing → Customer portal** antes de usarlo.

```bash
supabase functions deploy create-billing-portal-session --no-verify-jwt
```

## `stripe-webhook`

Verifica la firma con **`STRIPE_WEBHOOK_SECRET`**, lee el **body en bruto** y actualiza `public.subscriptions` + `public.profiles`.

**Secrets que configuras:** `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`.  
**Service role:** la provee Supabase en el entorno de la función (no hace falta `secrets set`).

```bash
supabase secrets set STRIPE_WEBHOOK_SECRET=whsec_xxx
supabase functions deploy stripe-webhook --no-verify-jwt
```

En Stripe Dashboard, endpoint: `https://<ref>.supabase.co/functions/v1/stripe-webhook`  
Eventos: `checkout.session.completed`, `customer.subscription.created`, `customer.subscription.updated`, `customer.subscription.deleted`.

Si el **Signing secret** (`whsec_`) no coincide con el guardado en Supabase, Stripe muestra entregas fallidas (400) y el plan no se actualiza.

## `sync-stripe-subscription`

Resincroniza suscripción activa desde la API de Stripe usando el **JWT del usuario** (útil si el webhook falló). Misma secret `STRIPE_SECRET_KEY` que el modo (test/live) del pago.

```bash
supabase functions deploy sync-stripe-subscription --no-verify-jwt
```

### Si ves 404 + CORS en checkout

La función **no está** desplegada en el proyecto remoto.

## `send-business-invite`

Guarda la invitación en `public.business_invites` y envía correo vía Resend.

Secrets:

- `RESEND_API_KEY`
- `INVITE_FROM_EMAIL` (ej. `equipo@tudominio.com`)
- `APP_BASE_URL` (ej. `https://app.moneymachine.com.mx`)

Deploy:

```bash
supabase secrets set RESEND_API_KEY=re_xxx
supabase secrets set INVITE_FROM_EMAIL=equipo@tudominio.com
supabase secrets set APP_BASE_URL=https://app.moneymachine.com.mx
supabase functions deploy send-business-invite --no-verify-jwt
```
