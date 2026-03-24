-- MoneyMachine — ejecutar en Supabase SQL Editor (o migraciones).
-- Habilita la extensión si hace falta:
-- create extension if not exists "pgcrypto";

-- Perfiles (1:1 con auth.users)
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text,
  name text,
  plan text not null default 'free',
  billing_status text not null default 'trial',
  trial_ends_at timestamptz,
  created_at timestamptz not null default now()
);

-- Negocios del usuario
create table if not exists public.businesses (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  name text not null,
  type text not null,
  slug text not null,
  logo_url text,
  theme_color text default '#22c55e',
  modules_enabled jsonb default '{"inventory": false, "reports": false, "multi_store": false}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists businesses_user_id_idx on public.businesses (user_id);
create unique index if not exists businesses_slug_unique on public.businesses (slug);

create table if not exists public.business_members (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses (id) on delete cascade,
  user_id uuid not null references auth.users (id) on delete cascade,
  role text not null default 'owner',
  created_at timestamptz not null default now(),
  unique (business_id, user_id)
);

create index if not exists business_members_user_id_idx on public.business_members (user_id);

create table if not exists public.business_invites (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses (id) on delete cascade,
  email text not null,
  role text not null check (role in ('admin', 'cashier')),
  invited_by uuid references auth.users (id) on delete set null,
  created_at timestamptz not null default now(),
  unique (business_id, email)
);

create index if not exists business_invites_business_id_idx on public.business_invites (business_id);

-- Suscripciones Stripe (escritura solo service role / Edge Functions)
create table if not exists public.subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  stripe_customer_id text not null,
  stripe_subscription_id text not null,
  status text not null,
  price_id text,
  current_period_end timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (stripe_subscription_id)
);

create index if not exists subscriptions_user_id_idx on public.subscriptions (user_id);
create index if not exists subscriptions_status_idx on public.subscriptions (status);

-- RLS helpers (SECURITY DEFINER): evitan recursión entre businesses ↔ business_members
create or replace function public.mm_user_owns_business(p_business_id uuid, p_user_id uuid)
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1 from public.businesses b
    where b.id = p_business_id and b.user_id = p_user_id
  );
$$;

create or replace function public.mm_current_user_is_member_of_business(p_business_id uuid)
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1 from public.business_members bm
    where bm.business_id = p_business_id and bm.user_id = auth.uid()
  );
$$;

create or replace function public.mm_current_user_can_manage_business(p_business_id uuid)
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1 from public.businesses b
    where b.id = p_business_id and b.user_id = auth.uid()
  )
  or exists (
    select 1 from public.business_members bm
    where bm.business_id = p_business_id
      and bm.user_id = auth.uid()
      and bm.role in ('owner', 'admin')
  );
$$;

create or replace function public.mm_profile_shares_business_with_me(p_profile_id uuid)
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1 from public.business_members bm1
    inner join public.business_members bm2 on bm2.business_id = bm1.business_id
    where bm1.user_id = auth.uid()
      and bm2.user_id = p_profile_id
  );
$$;

grant execute on function public.mm_user_owns_business(uuid, uuid) to authenticated;
grant execute on function public.mm_current_user_is_member_of_business(uuid) to authenticated;
grant execute on function public.mm_current_user_can_manage_business(uuid) to authenticated;
grant execute on function public.mm_profile_shares_business_with_me(uuid) to authenticated;

alter table public.profiles enable row level security;
alter table public.businesses enable row level security;
alter table public.business_members enable row level security;
alter table public.business_invites enable row level security;
alter table public.subscriptions enable row level security;

-- Políticas profiles
create policy "profiles_select_own"
  on public.profiles for select
  using (auth.uid() = id);

create policy "profiles_insert_own"
  on public.profiles for insert
  with check (auth.uid() = id);

create policy "profiles_update_own"
  on public.profiles for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

create policy "profiles_select_coworkers"
  on public.profiles for select
  using (public.mm_profile_shares_business_with_me(id));

-- Políticas businesses (dueño o miembro; actualización dueño o admin)
create policy "businesses_select_access"
  on public.businesses for select
  using (
    user_id = auth.uid()
    or public.mm_current_user_is_member_of_business(id)
  );

create policy "businesses_insert_own"
  on public.businesses for insert
  with check (auth.uid() = user_id);

create policy "businesses_update_access"
  on public.businesses for update
  using (public.mm_current_user_can_manage_business(id))
  with check (public.mm_current_user_can_manage_business(id));

create policy "business_members_select_org"
  on public.business_members for select
  using (public.mm_current_user_is_member_of_business(business_id));

create policy "business_members_insert_as_owner"
  on public.business_members for insert
  with check (
    auth.uid() = user_id
    and public.mm_user_owns_business(business_id, auth.uid())
  );

create policy "business_members_insert_by_manager"
  on public.business_members for insert
  with check (public.mm_current_user_can_manage_business(business_id));

create policy "business_invites_select"
  on public.business_invites for select
  using (
    public.mm_current_user_is_member_of_business(business_id)
    or public.mm_user_owns_business(business_id, auth.uid())
  );

create policy "business_invites_insert"
  on public.business_invites for insert
  with check (public.mm_current_user_can_manage_business(business_id));

create policy "business_invites_delete"
  on public.business_invites for delete
  using (public.mm_current_user_can_manage_business(business_id));

create policy "subscriptions_select_own"
  on public.subscriptions for select
  using (auth.uid() = user_id);

-- RPC: negocio + membresía (multi-tenant)
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
  v_slug text;
  base text;
  attempts int := 0;
begin
  if uid is null then
    raise exception 'Not authenticated';
  end if;
  if p_name is null or length(trim(p_name)) < 1 then
    raise exception 'Business name required';
  end if;

  base := trim(both '-' from lower(regexp_replace(trim(p_name), '[^a-zA-Z0-9]+', '-', 'g')));
  if base is null or base = '' then
    base := 'negocio';
  end if;
  base := left(base, 60);

  loop
    attempts := attempts + 1;
    if attempts > 10 then
      raise exception 'Could not allocate unique slug';
    end if;
    v_slug := base || '-' || substr(replace(gen_random_uuid()::text, '-', ''), 1, 10);
    begin
      insert into public.businesses (user_id, name, type, slug)
      values (
        uid,
        trim(p_name),
        coalesce(nullif(trim(p_type), ''), 'store'),
        v_slug
      )
      returning id into new_id;
      exit;
    exception
      when unique_violation then
        null;
    end;
  end loop;

  insert into public.business_members (business_id, user_id, role)
  values (new_id, uid, 'owner');

  return new_id;
end;
$$;

grant execute on function public.create_business_and_membership(text, text) to authenticated;

-- Trigger: crea perfil al registrarse (metadata full_name desde signUp options.data)
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, name, plan, billing_status, trial_ends_at, created_at)
  values (
    new.id,
    new.email,
    nullif(trim(coalesce(new.raw_user_meta_data->>'full_name', '')), ''),
    'free',
    'trial',
    now() + interval '7 days',
    now()
  )
  on conflict (id) do update set
    email = excluded.email,
    name = coalesce(excluded.name, public.profiles.name);
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
