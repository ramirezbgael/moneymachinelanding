-- =============================================================================
-- Alinea public.businesses con el esquema MoneyMachine (RPC create_business_and_membership).
-- Errores 42703 típicos: falta user_id, type, name, etc.
-- Ejecuta TODO en Supabase → SQL Editor.
-- =============================================================================

-- Si usaste owner_id en lugar de user_id:
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'businesses' AND column_name = 'owner_id'
  ) AND NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'businesses' AND column_name = 'user_id'
  ) THEN
    ALTER TABLE public.businesses RENAME COLUMN owner_id TO user_id;
  END IF;
END $$;

-- Si usaste business_type u otro nombre para el tipo de negocio:
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'businesses' AND column_name = 'business_type'
  ) AND NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'businesses' AND column_name = 'type'
  ) THEN
    ALTER TABLE public.businesses RENAME COLUMN business_type TO type;
  END IF;
END $$;

ALTER TABLE public.businesses
  ADD COLUMN IF NOT EXISTS user_id uuid REFERENCES auth.users (id) ON DELETE CASCADE;

-- Columnas que inserta el RPC: (user_id, name, type)
ALTER TABLE public.businesses
  ADD COLUMN IF NOT EXISTS name text;

ALTER TABLE public.businesses
  ADD COLUMN IF NOT EXISTS type text;

ALTER TABLE public.businesses
  ADD COLUMN IF NOT EXISTS created_at timestamptz DEFAULT now();

-- Valores por defecto en filas antiguas que quedaron con NULL
UPDATE public.businesses SET name = 'Negocio' WHERE name IS NULL OR trim(name) = '';
UPDATE public.businesses SET type = 'store' WHERE type IS NULL OR trim(type) = '';
UPDATE public.businesses SET created_at = now() WHERE created_at IS NULL;

-- NOT NULL acorde al schema (solo si ya no hay NULLs)
ALTER TABLE public.businesses ALTER COLUMN name SET NOT NULL;
ALTER TABLE public.businesses ALTER COLUMN type SET NOT NULL;
ALTER TABLE public.businesses ALTER COLUMN created_at SET NOT NULL;
ALTER TABLE public.businesses ALTER COLUMN created_at SET DEFAULT now();

CREATE INDEX IF NOT EXISTS businesses_user_id_idx ON public.businesses (user_id);

-- Políticas RLS (user_id)
DROP POLICY IF EXISTS "businesses_select_own" ON public.businesses;
DROP POLICY IF EXISTS "businesses_insert_own" ON public.businesses;
DROP POLICY IF EXISTS "businesses_update_own" ON public.businesses;

CREATE POLICY "businesses_select_own"
  ON public.businesses FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "businesses_insert_own"
  ON public.businesses FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "businesses_update_own"
  ON public.businesses FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

NOTIFY pgrst, 'reload schema';
