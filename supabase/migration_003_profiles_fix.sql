-- =============================================================================
-- Arregla PGRST204: columnas faltantes en public.profiles + recarga API
-- Ejecuta TODO en Supabase → SQL Editor
-- =============================================================================

alter table public.profiles add column if not exists email text;
alter table public.profiles add column if not exists name text;
alter table public.profiles add column if not exists plan text;
alter table public.profiles add column if not exists billing_status text;
alter table public.profiles add column if not exists trial_ends_at timestamptz;
alter table public.profiles add column if not exists created_at timestamptz;

update public.profiles set plan = 'trial' where plan is null;
update public.profiles set billing_status = 'trial' where billing_status is null;
update public.profiles set created_at = now() where created_at is null;

alter table public.profiles alter column plan set default 'trial';
alter table public.profiles alter column billing_status set default 'trial';
alter table public.profiles alter column created_at set default now();

alter table public.profiles enable row level security;

drop policy if exists "profiles_select_own" on public.profiles;
drop policy if exists "profiles_insert_own" on public.profiles;
drop policy if exists "profiles_update_own" on public.profiles;

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

-- Si el registro exige confirmar email, el cliente no tiene sesión al crear cuenta:
-- ejecuta también migration_004_profiles_trigger_rls.sql (trigger handle_new_user).

-- PostgREST: refrescar caché del esquema (evita PGRST204 tras ADD COLUMN)
notify pgrst, 'reload schema';
