-- =============================================================================
-- Stripe: tabla subscriptions + perfiles (plan free/pro).
-- auth.users no admite columnas custom en Supabase: usamos public.profiles.
-- =============================================================================

CREATE TABLE IF NOT EXISTS public.subscriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users (id) ON DELETE CASCADE,
  stripe_customer_id text NOT NULL,
  stripe_subscription_id text NOT NULL,
  status text NOT NULL,
  price_id text,
  current_period_end timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (stripe_subscription_id)
);

CREATE INDEX IF NOT EXISTS subscriptions_user_id_idx ON public.subscriptions (user_id);
CREATE INDEX IF NOT EXISTS subscriptions_status_idx ON public.subscriptions (status);

ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;

-- Solo lectura del propio usuario (escritura vía service role en Edge Functions)
DROP POLICY IF EXISTS "subscriptions_select_own" ON public.subscriptions;
CREATE POLICY "subscriptions_select_own"
  ON public.subscriptions FOR SELECT
  USING (auth.uid() = user_id);

-- Perfil: plan por defecto "free" (trial de marketing sigue en billing_status / trial_ends_at)
ALTER TABLE public.profiles
  ALTER COLUMN plan SET DEFAULT 'free';

COMMENT ON COLUMN public.profiles.plan IS 'free | trial | pro | business — webhook Stripe pone pro al pagar';

-- Nuevos registros: plan free + periodo de prueba en billing_status
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, name, plan, billing_status, trial_ends_at, created_at)
  VALUES (
    new.id,
    new.email,
    NULLIF(TRIM(COALESCE(new.raw_user_meta_data->>'full_name', '')), ''),
    'free',
    'trial',
    now() + interval '7 days',
    now()
  )
  ON CONFLICT (id) DO UPDATE SET
    email = excluded.email,
    name = COALESCE(excluded.name, public.profiles.name);
  RETURN new;
END;
$$;

-- updated_at lo actualiza la Edge Function stripe-webhook en cada evento

NOTIFY pgrst, 'reload schema';
