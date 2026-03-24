-- =============================================================================
-- Dashboard SaaS: columnas en businesses, invitaciones, RLS ampliado, perfiles
-- de compañeros, bucket de logos. Ejecuta en Supabase → SQL Editor.
-- =============================================================================

-- Columnas opcionales para ajustes y módulos (JSON coherente con la app)
ALTER TABLE public.businesses
  ADD COLUMN IF NOT EXISTS logo_url text,
  ADD COLUMN IF NOT EXISTS theme_color text DEFAULT '#22c55e',
  ADD COLUMN IF NOT EXISTS modules_enabled jsonb DEFAULT '{"inventory": false, "reports": false, "multi_store": false}'::jsonb;

UPDATE public.businesses
SET modules_enabled = '{"inventory": false, "reports": false, "multi_store": false}'::jsonb
WHERE modules_enabled IS NULL;

-- Invitaciones pendientes (email + rol; el alta en business_members puede ser manual o vía flujo futuro)
CREATE TABLE IF NOT EXISTS public.business_invites (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id uuid NOT NULL REFERENCES public.businesses (id) ON DELETE CASCADE,
  email text NOT NULL,
  role text NOT NULL CHECK (role IN ('admin', 'cashier')),
  invited_by uuid REFERENCES auth.users (id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (business_id, email)
);

ALTER TABLE public.business_invites ENABLE ROW LEVEL SECURITY;

CREATE INDEX IF NOT EXISTS business_invites_business_id_idx ON public.business_invites (business_id);

-- Bucket público para logos (ruta: {business_id}/archivo)
INSERT INTO storage.buckets (id, name, public)
VALUES ('business-logos', 'business-logos', true)
ON CONFLICT (id) DO NOTHING;

-- ---------- RLS: businesses (dueño o miembro ve filas; actualiza dueño o admin) ----------
DROP POLICY IF EXISTS "businesses_select_own" ON public.businesses;
DROP POLICY IF EXISTS "businesses_update_own" ON public.businesses;

CREATE POLICY "businesses_select_access"
  ON public.businesses FOR SELECT
  USING (
    user_id = auth.uid()
    OR EXISTS (
      SELECT 1 FROM public.business_members bm
      WHERE bm.business_id = businesses.id AND bm.user_id = auth.uid()
    )
  );

CREATE POLICY "businesses_update_access"
  ON public.businesses FOR UPDATE
  USING (
    user_id = auth.uid()
    OR EXISTS (
      SELECT 1 FROM public.business_members bm
      WHERE bm.business_id = businesses.id
        AND bm.user_id = auth.uid()
        AND bm.role IN ('owner', 'admin')
    )
  )
  WITH CHECK (
    user_id = auth.uid()
    OR EXISTS (
      SELECT 1 FROM public.business_members bm
      WHERE bm.business_id = businesses.id
        AND bm.user_id = auth.uid()
        AND bm.role IN ('owner', 'admin')
    )
  );

-- ---------- RLS: business_members ----------
DROP POLICY IF EXISTS "business_members_select_own" ON public.business_members;

CREATE POLICY "business_members_select_org"
  ON public.business_members FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.business_members bm
      WHERE bm.business_id = business_members.business_id
        AND bm.user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "business_members_insert_own" ON public.business_members;

-- Solo el dueño del negocio puede darse de alta como miembro (onboarding / RPC definer)
CREATE POLICY "business_members_insert_as_owner"
  ON public.business_members FOR INSERT
  WITH CHECK (
    auth.uid() = user_id
    AND EXISTS (
      SELECT 1 FROM public.businesses b
      WHERE b.id = business_members.business_id
        AND b.user_id = auth.uid()
    )
  );

-- Admin/owner existente puede añadir otros usuarios
CREATE POLICY "business_members_insert_by_manager"
  ON public.business_members FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.business_members bm
      WHERE bm.business_id = business_members.business_id
        AND bm.user_id = auth.uid()
        AND bm.role IN ('owner', 'admin')
    )
  );

-- ---------- RLS: business_invites ----------
CREATE POLICY "business_invites_select"
  ON public.business_invites FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.business_members bm
      WHERE bm.business_id = business_invites.business_id
        AND bm.user_id = auth.uid()
    )
    OR EXISTS (
      SELECT 1 FROM public.businesses b
      WHERE b.id = business_invites.business_id
        AND b.user_id = auth.uid()
    )
  );

CREATE POLICY "business_invites_insert"
  ON public.business_invites FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.business_members bm
      WHERE bm.business_id = business_invites.business_id
        AND bm.user_id = auth.uid()
        AND bm.role IN ('owner', 'admin')
    )
    OR EXISTS (
      SELECT 1 FROM public.businesses b
      WHERE b.id = business_invites.business_id
        AND b.user_id = auth.uid()
    )
  );

CREATE POLICY "business_invites_delete"
  ON public.business_invites FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.business_members bm
      WHERE bm.business_id = business_invites.business_id
        AND bm.user_id = auth.uid()
        AND bm.role IN ('owner', 'admin')
    )
    OR EXISTS (
      SELECT 1 FROM public.businesses b
      WHERE b.id = business_invites.business_id
        AND b.user_id = auth.uid()
    )
  );

-- ---------- RLS: ver emails de compañeros en el mismo negocio ----------
CREATE POLICY "profiles_select_coworkers"
  ON public.profiles FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.business_members bm1
      INNER JOIN public.business_members bm2 ON bm2.business_id = bm1.business_id
      WHERE bm1.user_id = auth.uid()
        AND bm2.user_id = profiles.id
    )
  );

-- ---------- Storage: logos ----------
DROP POLICY IF EXISTS "business_logos_select" ON storage.objects;
CREATE POLICY "business_logos_select"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'business-logos');

DROP POLICY IF EXISTS "business_logos_insert" ON storage.objects;
CREATE POLICY "business_logos_insert"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'business-logos'
    AND EXISTS (
      SELECT 1 FROM public.businesses b
      WHERE b.id::text = split_part(name, '/', 1)
        AND (
          b.user_id = auth.uid()
          OR EXISTS (
            SELECT 1 FROM public.business_members bm
            WHERE bm.business_id = b.id
              AND bm.user_id = auth.uid()
              AND bm.role IN ('owner', 'admin')
          )
        )
    )
  );

DROP POLICY IF EXISTS "business_logos_update" ON storage.objects;
CREATE POLICY "business_logos_update"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (
    bucket_id = 'business-logos'
    AND EXISTS (
      SELECT 1 FROM public.businesses b
      WHERE b.id::text = split_part(name, '/', 1)
        AND (
          b.user_id = auth.uid()
          OR EXISTS (
            SELECT 1 FROM public.business_members bm
            WHERE bm.business_id = b.id
              AND bm.user_id = auth.uid()
              AND bm.role IN ('owner', 'admin')
          )
        )
    )
  );

DROP POLICY IF EXISTS "business_logos_delete" ON storage.objects;
CREATE POLICY "business_logos_delete"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'business-logos'
    AND EXISTS (
      SELECT 1 FROM public.businesses b
      WHERE b.id::text = split_part(name, '/', 1)
        AND (
          b.user_id = auth.uid()
          OR EXISTS (
            SELECT 1 FROM public.business_members bm
            WHERE bm.business_id = b.id
              AND bm.user_id = auth.uid()
              AND bm.role IN ('owner', 'admin')
          )
        )
    )
  );

NOTIFY pgrst, 'reload schema';

-- Si ves error 500 al leer profiles/businesses (recursión RLS), ejecuta además
-- migration_008_rls_no_recursion.sql
