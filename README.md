# MoneyMachine

SaaS landing optimizada para conversión + auth (Supabase) + onboarding + dashboard, con **React (Vite)**, **Tailwind**, **React Router**, **Framer Motion** y **Supabase**.

## Quick start

```bash
npm install
cp .env.example .env
npm run dev
```

## Supabase

1. Crea un proyecto en [supabase.com](https://supabase.com).
2. En **SQL Editor**, ejecuta `supabase/schema.sql` (instalación nueva).
3. Si ya tenías el schema anterior, ejecuta además `supabase/migration_002_conversion.sql` (columna `billing_status`, tabla `business_members`, RPC `create_business_and_membership`).
4. Si ves **`PGRST204`** / *Could not find the 'email' or 'billing_status' column* al registrarte, ejecuta **`supabase/migration_003_profiles_fix.sql`** (añade columnas a `profiles`, RLS y **`notify pgrst, 'reload schema'`** para refrescar la API).
5. Si al registrarte ves **`42501`** / *row-level security policy* o el perfil no se crea con **confirmación de email** activada, ejecuta **`supabase/migration_004_profiles_trigger_rls.sql`** (trigger `handle_new_user` que inserta el perfil sin JWT + política `UPDATE` con `WITH CHECK`).
6. Si al crear el negocio ves **`42703`** en `businesses` (*column "user_id"*, *"type"*, *"name"*, etc. *does not exist*), ejecuta **`supabase/migration_005_businesses_user_id.sql`** (alinea columnas con el RPC: `user_id`, `name`, `type`, `created_at`; renombra `owner_id` → `user_id` o `business_type` → `type` si aplica; índice y RLS).
7. Si ves **`23502`** / *null value in column "slug" of relation "businesses"*, tu tabla exige **`slug`** y el RPC antiguo no lo rellenaba: ejecuta **`supabase/migration_006_businesses_slug_rpc.sql`** (columna `slug` si falta, índice único, RPC que genera slug desde el nombre).
8. Para el **dashboard SaaS** (lista de equipo, invitaciones, `modules_enabled`, logo en Storage, RLS por organización): ejecuta **`supabase/migration_007_dashboard_workspace.sql`**.
9. Si el dashboard devuelve **500** al cargar `profiles` / `businesses`, suele ser **recursión en RLS**: ejecuta **`supabase/migration_008_rls_no_recursion.sql`** (funciones `mm_*` + políticas corregidas).
10. **Authentication → Providers**: Email activado.
11. En dev puedes desactivar **Confirm email** para tener sesión al instante tras el registro (los usuarios suelen tener `email_confirmed_at` rellenado y no verán el banner de verificación).
12. Para envío real de invitaciones por correo desde **Usuarios**, despliega `send-business-invite` y configura secrets (`RESEND_API_KEY`, `INVITE_FROM_EMAIL`, `APP_BASE_URL`) según `supabase/functions/README.md`.

### Auth: callback y verificación de email

En **Authentication → URL Configuration**:

- **Site URL**: `http://localhost:5173` (producción: tu dominio).
- **Redirect URLs** (añade al menos):  
  `http://localhost:5173/auth/callback`  
  `http://localhost:5173/auth/reset-password`  
  y las mismas rutas con tu dominio de producción.

El registro usa `emailRedirectTo` → `/auth/callback`. Tras confirmar, Supabase intercambia el `code` (PKCE) por sesión y la app redirige a `/dashboard`.

- **Rutas**: `/login`, `/register` (alias `/signup` → `/register`), `/public` (landing), `/pricing`, `/auth/callback`.
- **Comportamiento**: usuario autenticado **sin** `email_confirmed_at` puede navegar (dashboard/onboarding) pero no puede pagar con Stripe, crear negocio (onboarding) ni “Actualizar a Pro” hasta verificar; ver `EmailVerificationBanner`, modal y toasts vía `useVerificationGate().ensureVerified()`.

### Env

| Variable | Descripción |
|----------|-------------|
| `VITE_SUPABASE_URL` | URL del proyecto |
| `VITE_SUPABASE_ANON_KEY` | Anon key |

## Stripe (Checkout en la landing)

La sección **Precios** y la página **Suscripción** (`/subscription`) abren **Stripe Checkout** vía la Edge Function **`create-checkout-session`**. Si esa función **no está desplegada** en tu proyecto, el navegador muestra errores tipo **«Preflight response is not successful. Status code: 404»**, **«TypeError: Load failed»** o **«access control checks»** — no es CORS mal configurado en tu app, es que la URL `/functions/v1/create-checkout-session` no existe en Supabase.

### Desplegar la Edge Function (obligatorio para Stripe)

1. Instala [Supabase CLI](https://supabase.com/docs/guides/cli) y entra: `supabase login`
2. En la raíz del repo: `supabase link --project-ref TU_PROJECT_REF` (el ref sale en **Project Settings → General**; también en la URL del dashboard)
3. En **SQL Editor**, ejecuta **`supabase/migration_009_stripe_subscriptions.sql`** (tabla `subscriptions`, `profiles.plan` por defecto `free`).
4. Secreto Stripe (servidor): `supabase secrets set STRIPE_SECRET_KEY=sk_test_...` (o `sk_live_...`)
5. **Webhook Stripe**: `supabase secrets set STRIPE_WEBHOOK_SECRET=whsec_...`  
   (Stripe → **Developers → Webhooks** → endpoint o `stripe listen --forward-to ...`).  
   **No intentes** `supabase secrets set SUPABASE_SERVICE_ROLE_KEY=...`: los nombres `SUPABASE_*` están reservados; **`SUPABASE_SERVICE_ROLE_KEY` la inyecta Supabase solo** en las funciones desplegadas.
6. Despliega:  
   `supabase functions deploy create-checkout-session --no-verify-jwt`  
   `supabase functions deploy stripe-webhook --no-verify-jwt`  
   `supabase functions deploy sync-stripe-subscription --no-verify-jwt` (opcional: botón «Sincronizar pago» en `/subscription` si el webhook falló)
7. En Stripe → **Webhooks**, añade la URL  
   `https://<PROJECT_REF>.supabase.co/functions/v1/stripe-webhook`  
   y eventos: **`checkout.session.completed`**, **`customer.subscription.created`**, **`customer.subscription.updated`**, **`customer.subscription.deleted`**.

Tras el deploy de checkout, el **OPTIONS** (preflight) debe responder **200** y el POST devolverá la URL de Checkout. El webhook actualiza **`profiles`** (`plan`, `billing_status`) y **`subscriptions`** al pagar o cancelar.  
Tras volver de Stripe con `?checkout=success`, el dashboard llama en segundo plano a **`sync-stripe-subscription`** varias veces (además de `refresh`) para que el plan se actualice aunque el webhook tarde o falle; el usuario no tiene que pulsar nada.  
**No guardes `service_role` ni `STRIPE_SECRET_KEY` en `.env` del repo** (solo `VITE_*` para el cliente); los secretos del servidor van con `supabase secrets set`.

#### Si pagaste y no aparece como Pro

1. **Mismo modo Stripe**: el pago en **Test** solo existe con `sk_test_` / webhook de *Test mode*; **Live** con `sk_live_` y webhook de *Live*. Si mezclas, Supabase no verá el pago.
2. **Webhook**: en Stripe → **Developers → Webhooks** → tu endpoint → **Recent deliveries**: si ves **400 Invalid signature**, el `STRIPE_WEBHOOK_SECRET` en Supabase no coincide con el **Signing secret** de *ese* endpoint (vuelve a copiar `whsec_...` y `supabase secrets set STRIPE_WEBHOOK_SECRET=...`).
3. **Función desplegada**: sin `stripe-webhook` desplegado, Stripe no actualiza la base de datos.
4. En la app, **Suscripción** → **«Sincronizar pago con mi cuenta»** (requiere `sync-stripe-subscription` desplegada + mismo `STRIPE_SECRET_KEY` que el modo en el que pagaste).

### Configuración de precios

1. En [Stripe Dashboard](https://dashboard.stripe.com) → **Productos**, cada producto debe tener un precio **recurrente** (mensual y/o anual). El CSV export suele traer solo `prod_...`; en la ficha del producto copia el **Price ID** (`price_...`).
2. Rellena en `.env` las variables `VITE_STRIPE_PRICE_*` (ver `.env.example`).

Los textos **$… / año** en `src/i18n.js` son orientativos; ajústalos para que coincidan con lo que cobras en Stripe.

| Variable | Uso |
|----------|-----|
| `VITE_STRIPE_PRICE_PRO_MONTHLY` | Pro mensual |
| `VITE_STRIPE_PRICE_PRO_YEARLY` | Pro anual |
| `VITE_STRIPE_PRICE_BUSINESS_MONTHLY` | Business mensual |
| `VITE_STRIPE_PRICE_BUSINESS_YEARLY` | Business anual |
| `VITE_STRIPE_PRICE_BASIC_ONETIME` | Básico pago único (`mode: payment`) |

## Rutas

| Ruta | Descripción |
|------|-------------|
| `/` | Landing (CTA → `/register`) |
| `/public` | Misma landing |
| `/register` | Registro (`/signup` redirige aquí); con sesión → `/dashboard` |
| `/login` | Entrada; respeta `state.from` si venía de una ruta protegida; enlace “Olvidé contraseña” |
| `/forgot-password` | Solicita correo de recuperación (`resetPasswordForEmail`) |
| `/auth/reset-password` | Enlace del correo: nueva contraseña (`updateUser`) |
| `/auth/callback` | Confirmación de email (PKCE) → sesión → `/dashboard` |
| `/pricing` | Planes + Stripe (requiere email verificado) |
| `/onboarding` | Crea negocio (RPC); requiere email verificado |
| `/dashboard` | Panel; sin negocio redirige a onboarding; paywall trial; “Actualizar a Pro” verificado |

## Datos

- **profiles**: `plan`, `billing_status` (`trial` \| `active`), `trial_ends_at`.
- **businesses** + **business_members** (owner) vía RPC.
- Paywall: `trial_ends_at` en el pasado y `billing_status !== 'active'`. **Actualizar a Pro** pone `plan: pro` y `billing_status: active` (demo) y exige **email verificado** (`email_confirmed_at`).
- Acciones restringidas sin verificar: Stripe checkout, crear negocio, upgrade demo (ver `useVerificationGate`).

Precios en la landing: **MXN**.

## Build

```bash
npm run build
npm run preview
```
