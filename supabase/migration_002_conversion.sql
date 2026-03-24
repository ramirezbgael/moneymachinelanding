-- Ejecutar si ya tenías schema.sql v1 (añade multi-tenant + billing + RPC).

alter table public.profiles
  add column if not exists billing_status text not null default 'trial';

comment on column public.profiles.billing_status is 'trial | active — paywall si trial expiró y no es active';

create table if not exists public.business_members (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses (id) on delete cascade,
  user_id uuid not null references auth.users (id) on delete cascade,
  role text not null default 'owner',
  created_at timestamptz not null default now(),
  unique (business_id, user_id)
);

create index if not exists business_members_user_id_idx on public.business_members (user_id);

alter table public.business_members enable row level security;

create policy "business_members_select_own"
  on public.business_members for select
  using (auth.uid() = user_id);

create policy "business_members_insert_own"
  on public.business_members for insert
  with check (auth.uid() = user_id);

-- RPC: crea negocio + membresía owner (multi-tenant)
-- OBLIGATORIO si ya existía la función con otros nombres de parámetro (p_slug, etc.): PG no permite renombrar args con REPLACE.
drop function if exists public.create_business_and_membership(text);
drop function if exists public.create_business_and_membership(text, text);

create function public.create_business_and_membership(p_name text, p_type text default 'store')
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  new_id uuid;
  uid uuid := auth.uid();
begin
  if uid is null then
    raise exception 'Not authenticated';
  end if;
  if p_name is null or length(trim(p_name)) < 1 then
    raise exception 'Business name required';
  end if;

  insert into public.businesses (user_id, name, type)
  values (uid, trim(p_name), coalesce(nullif(trim(p_type), ''), 'store'))
  returning id into new_id;

  insert into public.business_members (business_id, user_id, role)
  values (new_id, uid, 'owner');

  return new_id;
end;
$$;

grant execute on function public.create_business_and_membership(text, text) to authenticated;

-- Si public.businesses tiene columna slug NOT NULL (u otro esquema extendido), ejecuta además
-- migration_006_businesses_slug_rpc.sql para alinear el RPC.

-- Trigger perfil: incluir billing_status en nuevos inserts (si recreas trigger, usa schema.sql actualizado)
