-- =============================================================================
-- Error 23502: null value in column "slug" of relation "businesses" violates
-- not-null constraint — tu tabla tiene slug NOT NULL pero el RPC solo insertaba
-- user_id, name, type.
--
-- También sirve si aún no tienes columna slug: la crea, rellena filas viejas y
-- recrea el RPC. Ejecuta en Supabase → SQL Editor.
-- =============================================================================

ALTER TABLE public.businesses
  ADD COLUMN IF NOT EXISTS slug text;

-- Slug estable a partir del nombre + parte del id (filas existentes)
UPDATE public.businesses
SET slug =
  coalesce(
    nullif(
      trim(both '-' from lower(regexp_replace(trim(name), '[^a-zA-Z0-9]+', '-', 'g'))),
      ''
    ),
    'negocio'
  ) || '-' || left(replace(id::text, '-', ''), 12)
WHERE slug IS NULL OR trim(slug) = '';

-- Si quedaron slugs duplicados, añade sufijo aleatorio a los repetidos (excepto el primero)
UPDATE public.businesses b
SET slug = b.slug || '-' || substr(replace(gen_random_uuid()::text, '-', ''), 1, 8)
WHERE b.id IN (
  SELECT id FROM (
    SELECT id,
           row_number() OVER (PARTITION BY slug ORDER BY created_at NULLS LAST, id) AS rn
    FROM public.businesses
  ) t
  WHERE rn > 1
);

ALTER TABLE public.businesses
  ALTER COLUMN slug SET NOT NULL;

CREATE UNIQUE INDEX IF NOT EXISTS businesses_slug_unique ON public.businesses (slug);

-- RPC: inserta slug (reintenta si colisión en slug único)
DROP FUNCTION IF EXISTS public.create_business_and_membership(text);
DROP FUNCTION IF EXISTS public.create_business_and_membership(text, text);

CREATE FUNCTION public.create_business_and_membership(p_name text, p_type text DEFAULT 'store')
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  new_id uuid;
  uid uuid := auth.uid();
  v_slug text;
  base text;
  attempts int := 0;
BEGIN
  IF uid IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;
  IF p_name IS NULL OR length(trim(p_name)) < 1 THEN
    RAISE EXCEPTION 'Business name required';
  END IF;

  base := trim(both '-' FROM lower(regexp_replace(trim(p_name), '[^a-zA-Z0-9]+', '-', 'g')));
  IF base IS NULL OR base = '' THEN
    base := 'negocio';
  END IF;
  base := left(base, 60);

  LOOP
    attempts := attempts + 1;
    IF attempts > 10 THEN
      RAISE EXCEPTION 'Could not allocate unique slug';
    END IF;
    v_slug := base || '-' || substr(replace(gen_random_uuid()::text, '-', ''), 1, 10);
    BEGIN
      INSERT INTO public.businesses (user_id, name, type, slug)
      VALUES (
        uid,
        trim(p_name),
        coalesce(nullif(trim(p_type), ''), 'store'),
        v_slug
      )
      RETURNING id INTO new_id;
      EXIT;
    EXCEPTION
      WHEN unique_violation THEN
        NULL;
    END;
  END LOOP;

  INSERT INTO public.business_members (business_id, user_id, role)
  VALUES (new_id, uid, 'owner');

  RETURN new_id;
END;
$$;

GRANT EXECUTE ON FUNCTION public.create_business_and_membership(text, text) TO authenticated;

NOTIFY pgrst, 'reload schema';
