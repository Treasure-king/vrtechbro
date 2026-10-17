-- =====================================================================
-- Lock down every public table (Row Level Security)
-- =====================================================================
-- Why: tables in the `public` schema are reachable through Supabase's Data
-- API with the anon key, and that key is visible in every visitor's browser.
-- Without RLS, anyone holding it can read AND write those tables directly.
--
-- What this does (safe to run more than once):
--   services, blogs : anyone can read; only admins can write
--   jobs            : anyone can read OPEN roles; admins read and write all
--   contacts        : private; only admins can read or delete; no public access
--   admins          : a signed-in user can only see their own row
--
-- Run it: Supabase Dashboard -> SQL Editor -> New query -> paste -> Run.
-- Then run the checks at the bottom to confirm.
-- =====================================================================

-- 1. Admin check used by the policies (same definition as 2026-10-17_admin.sql)
create table if not exists public.admins (
  user_id uuid primary key references auth.users (id) on delete cascade,
  created_at timestamptz not null default now()
);

create or replace function public.is_admin()
returns boolean
language sql
security definer
set search_path = ''
stable
as $$
  select exists (select 1 from public.admins where user_id = auth.uid());
$$;

revoke execute on function public.is_admin() from public, anon;
grant execute on function public.is_admin() to authenticated;

-- 2. Turn RLS on everywhere. With RLS on and no matching policy, access is denied.
alter table public.admins   enable row level security;
alter table public.services enable row level security;
alter table public.blogs    enable row level security;
alter table public.jobs     enable row level security;
alter table public.contacts enable row level security;

-- 3. admins: users may only see their own row; nobody can add admins via the API
drop policy if exists "Users can read their own admin row" on public.admins;
create policy "Users can read their own admin row"
  on public.admins for select to authenticated
  using (user_id = (select auth.uid()));

-- 4. Public content: read for everyone, write for admins only
drop policy if exists "Public can read services" on public.services;
create policy "Public can read services"
  on public.services for select to anon, authenticated using (true);

drop policy if exists "Public can read blogs" on public.blogs;
create policy "Public can read blogs"
  on public.blogs for select to anon, authenticated using (true);

drop policy if exists "Public can read open jobs" on public.jobs;
create policy "Public can read open jobs"
  on public.jobs for select to anon, authenticated using (is_open = true);

do $$
declare
  t text;
begin
  foreach t in array array['services', 'blogs', 'jobs', 'contacts'] loop
    execute format('drop policy if exists "Admins can read all %1$s" on public.%1$I', t);
    execute format(
      'create policy "Admins can read all %1$s" on public.%1$I for select to authenticated using ((select public.is_admin()))', t);

    execute format('drop policy if exists "Admins can delete %1$s" on public.%1$I', t);
    execute format(
      'create policy "Admins can delete %1$s" on public.%1$I for delete to authenticated using ((select public.is_admin()))', t);
  end loop;

  -- contacts is read/delete only for admins; the others can also be created and edited
  foreach t in array array['services', 'blogs', 'jobs'] loop
    execute format('drop policy if exists "Admins can insert %1$s" on public.%1$I', t);
    execute format(
      'create policy "Admins can insert %1$s" on public.%1$I for insert to authenticated with check ((select public.is_admin()))', t);

    execute format('drop policy if exists "Admins can update %1$s" on public.%1$I', t);
    execute format(
      'create policy "Admins can update %1$s" on public.%1$I for update to authenticated using ((select public.is_admin())) with check ((select public.is_admin()))', t);
  end loop;
end $$;

-- 5. contacts holds personal data and the website no longer writes to it
--    (form messages are emailed). Remove anonymous access at the privilege
--    level too, as a second barrier behind RLS.
revoke all on table public.contacts from anon;

-- Reminder: any NEW table you add to `public` later needs
--   alter table public.<name> enable row level security;
-- plus policies, or it will be readable and writable through the Data API.

-- =====================================================================
-- Checks (run after the script above)
-- =====================================================================
-- Every table should show rls_enabled = true:
--   select tablename, rowsecurity as rls_enabled
--   from pg_tables where schemaname = 'public' order by tablename;
--
-- Policies per table:
--   select tablename, policyname, cmd, roles
--   from pg_policies where schemaname = 'public' order by tablename, cmd;
-- =====================================================================
