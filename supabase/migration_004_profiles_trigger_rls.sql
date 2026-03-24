-- =============================================================================
-- Perfil al registrarse + RLS coherente (evita 42501 sin sesión JWT)
-- Ejecuta en Supabase → SQL Editor después de migration_003
--
-- Problema: si "Confirm email" está ON, signUp no devuelve sesión; el cliente
-- no tiene auth.uid() y el INSERT a profiles falla por RLS.
-- Solución: trigger SECURITY DEFINER en auth.users que inserta el perfil
-- sin pasar por RLS del rol anon/authenticated del cliente.
-- =============================================================================

-- Política UPDATE: WITH CHECK explícito (PostgREST / upsert más predecible)
drop policy if exists "profiles_update_own" on public.profiles;

create policy "profiles_update_own"
  on public.profiles for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- Función y trigger: crea/actualiza perfil al crear usuario en auth
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
    'trial',
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

notify pgrst, 'reload schema';
