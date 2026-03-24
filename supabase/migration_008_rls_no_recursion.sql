-- =============================================================================
-- Error 500 en REST (profiles / businesses): recursión infinita en RLS.
-- Las políticas que hacen EXISTS sobre business_members al evaluar otra fila
-- de business_members (o businesses) vuelven a disparar RLS → fallo en cadena.
--
-- Solución: funciones STABLE + SECURITY DEFINER que leen las tablas sin RLS.
-- Ejecuta en Supabase → SQL Editor después de migration_007.
-- =============================================================================

CREATE OR REPLACE FUNCTION public.mm_user_owns_business(p_business_id uuid, p_user_id uuid)
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.businesses b
    WHERE b.id = p_business_id AND b.user_id = p_user_id
  );
$$;

CREATE OR REPLACE FUNCTION public.mm_current_user_is_member_of_business(p_business_id uuid)
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.business_members bm
    WHERE bm.business_id = p_business_id AND bm.user_id = auth.uid()
  );
$$;

CREATE OR REPLACE FUNCTION public.mm_current_user_can_manage_business(p_business_id uuid)
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.businesses b
    WHERE b.id = p_business_id AND b.user_id = auth.uid()
  )
  OR EXISTS (
    SELECT 1 FROM public.business_members bm
    WHERE bm.business_id = p_business_id
      AND bm.user_id = auth.uid()
      AND bm.role IN ('owner', 'admin')
  );
$$;

CREATE OR REPLACE FUNCTION public.mm_profile_shares_business_with_me(p_profile_id uuid)
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.business_members bm1
    INNER JOIN public.business_members bm2 ON bm2.business_id = bm1.business_id
    WHERE bm1.user_id = auth.uid()
      AND bm2.user_id = p_profile_id
  );
$$;

CREATE OR REPLACE FUNCTION public.mm_storage_logo_allowed(p_object_name text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
DECLARE
  bid uuid;
BEGIN
  IF p_object_name IS NULL OR length(trim(p_object_name)) < 1 THEN
    RETURN false;
  END IF;
  bid := split_part(p_object_name, '/', 1)::uuid;
  RETURN public.mm_current_user_can_manage_business(bid);
EXCEPTION
  WHEN invalid_text_representation THEN
    RETURN false;
END;
$$;

GRANT EXECUTE ON FUNCTION public.mm_user_owns_business(uuid, uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.mm_current_user_is_member_of_business(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.mm_current_user_can_manage_business(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.mm_profile_shares_business_with_me(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.mm_storage_logo_allowed(text) TO authenticated;

-- ---------- businesses ----------
DROP POLICY IF EXISTS "businesses_select_access" ON public.businesses;
DROP POLICY IF EXISTS "businesses_update_access" ON public.businesses;

CREATE POLICY "businesses_select_access"
  ON public.businesses FOR SELECT
  USING (
    user_id = auth.uid()
    OR public.mm_current_user_is_member_of_business(id)
  );

CREATE POLICY "businesses_update_access"
  ON public.businesses FOR UPDATE
  USING (public.mm_current_user_can_manage_business(id))
  WITH CHECK (public.mm_current_user_can_manage_business(id));

-- ---------- business_members ----------
DROP POLICY IF EXISTS "business_members_select_org" ON public.business_members;

CREATE POLICY "business_members_select_org"
  ON public.business_members FOR SELECT
  USING (public.mm_current_user_is_member_of_business(business_id));

DROP POLICY IF EXISTS "business_members_insert_as_owner" ON public.business_members;
DROP POLICY IF EXISTS "business_members_insert_by_manager" ON public.business_members;

CREATE POLICY "business_members_insert_as_owner"
  ON public.business_members FOR INSERT
  WITH CHECK (
    auth.uid() = user_id
    AND public.mm_user_owns_business(business_id, auth.uid())
  );

CREATE POLICY "business_members_insert_by_manager"
  ON public.business_members FOR INSERT
  WITH CHECK (public.mm_current_user_can_manage_business(business_id));

-- ---------- business_invites ----------
DROP POLICY IF EXISTS "business_invites_select" ON public.business_invites;
DROP POLICY IF EXISTS "business_invites_insert" ON public.business_invites;
DROP POLICY IF EXISTS "business_invites_delete" ON public.business_invites;

CREATE POLICY "business_invites_select"
  ON public.business_invites FOR SELECT
  USING (
    public.mm_current_user_is_member_of_business(business_id)
    OR public.mm_user_owns_business(business_id, auth.uid())
  );

CREATE POLICY "business_invites_insert"
  ON public.business_invites FOR INSERT
  WITH CHECK (
    public.mm_current_user_can_manage_business(business_id)
  );

CREATE POLICY "business_invites_delete"
  ON public.business_invites FOR DELETE
  USING (
    public.mm_current_user_can_manage_business(business_id)
  );

-- ---------- profiles (coworkers) ----------
DROP POLICY IF EXISTS "profiles_select_coworkers" ON public.profiles;

CREATE POLICY "profiles_select_coworkers"
  ON public.profiles FOR SELECT
  USING (public.mm_profile_shares_business_with_me(id));

-- ---------- storage ----------
DROP POLICY IF EXISTS "business_logos_insert" ON storage.objects;
CREATE POLICY "business_logos_insert"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'business-logos'
    AND public.mm_storage_logo_allowed(name)
  );

DROP POLICY IF EXISTS "business_logos_update" ON storage.objects;
CREATE POLICY "business_logos_update"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (
    bucket_id = 'business-logos'
    AND public.mm_storage_logo_allowed(name)
  );

DROP POLICY IF EXISTS "business_logos_delete" ON storage.objects;
CREATE POLICY "business_logos_delete"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'business-logos'
    AND public.mm_storage_logo_allowed(name)
  );

NOTIFY pgrst, 'reload schema';
