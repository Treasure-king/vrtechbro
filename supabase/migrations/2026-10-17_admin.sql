-- =============================================================
-- Admin panel: who may edit content, and what they may edit.
--
-- How to run: Supabase dashboard -> SQL Editor -> New query ->
-- paste this whole file -> Run. Run 2026-10-15_create_jobs.sql
-- first. Safe to re-run: every statement is idempotent.
--
-- Make your first admin:
--   1. Dashboard -> Authentication -> Users -> Add user
--      (email + strong password; tick "Auto confirm user").
--   2. Run in the SQL Editor (with your email):
--        insert into public.admins (user_id)
--        select id from auth.users where email = 'you@example.com';
--   3. Sign in at /admin/login.
-- To remove an admin: delete their row from public.admins.
--
-- Security model:
--   * The website only ever uses the public anon key. The admin area
--     uses it too, but with the signed-in user's session, so every
--     write is checked by the policies below.
--   * Only users listed in public.admins can write. Nobody can add
--     themselves: public.admins has no insert/update/delete policies,
--     so rows can only be added here, in the SQL Editor.
-- =============================================================

-- -------------------------------------------------------------
-- 1. Admin list
-- -------------------------------------------------------------
create table if not exists public.admins (
  user_id uuid primary key references auth.users (id) on delete cascade,
  created_at timestamptz not null default now()
);

alter table public.admins enable row level security;

drop policy if exists "Users can read their own admin row" on public.admins;
create policy "Users can read their own admin row"
  on public.admins
  for select
  to authenticated
  using (user_id = (select auth.uid()));

-- -------------------------------------------------------------
-- 2. is_admin(): true when the current user is in public.admins.
--    security definer so it can read admins regardless of RLS;
--    empty search_path so it cannot be hijacked by shadow objects.
-- -------------------------------------------------------------
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.admins where user_id = (select auth.uid())
  );
$$;

revoke execute on function public.is_admin() from public, anon;
grant execute on function public.is_admin() to authenticated;

-- -------------------------------------------------------------
-- 3. Make sure every column the admin forms write exists.
--    (Existing columns are left untouched.)
-- -------------------------------------------------------------
alter table if exists public.services
  add column if not exists long_description text,
  add column if not exists content text,
  add column if not exists keywords text[],
  add column if not exists icon text,
  add column if not exists image_url text,
  add column if not exists category text,
  add column if not exists featured boolean not null default false,
  add column if not exists display_order int not null default 0,
  add column if not exists cta_label text,
  add column if not exists cta_enabled boolean not null default true,
  add column if not exists meta_title text,
  add column if not exists meta_description text,
  add column if not exists created_at timestamptz not null default now(),
  add column if not exists updated_at timestamptz not null default now();

alter table if exists public.blogs
  add column if not exists content text,
  add column if not exists keywords text[],
  add column if not exists tags text[],
  add column if not exists author text,
  add column if not exists thumbnail text,
  add column if not exists published_at timestamptz,
  add column if not exists reading_time int,
  add column if not exists meta_title text,
  add column if not exists meta_description text,
  add column if not exists created_at timestamptz not null default now(),
  add column if not exists updated_at timestamptz not null default now();

-- -------------------------------------------------------------
-- 4. Row-level security on content tables
-- -------------------------------------------------------------
alter table public.services enable row level security;
alter table public.blogs enable row level security;
alter table public.jobs enable row level security;

-- Public read access (same as the site has today)
drop policy if exists "Public can read services" on public.services;
create policy "Public can read services"
  on public.services for select to anon, authenticated using (true);

drop policy if exists "Public can read blogs" on public.blogs;
create policy "Public can read blogs"
  on public.blogs for select to anon, authenticated using (true);

-- jobs keeps "Public can read open jobs" from the jobs migration.

-- Admin access: read everything (including closed roles), write everything
do $$
declare
  t text;
begin
  foreach t in array array['services', 'blogs', 'jobs'] loop
    execute format('drop policy if exists "Admins can read all %1$s" on public.%1$I', t);
    execute format(
      'create policy "Admins can read all %1$s" on public.%1$I for select to authenticated using ((select public.is_admin()))', t);

    execute format('drop policy if exists "Admins can insert %1$s" on public.%1$I', t);
    execute format(
      'create policy "Admins can insert %1$s" on public.%1$I for insert to authenticated with check ((select public.is_admin()))', t);

    execute format('drop policy if exists "Admins can update %1$s" on public.%1$I', t);
    execute format(
      'create policy "Admins can update %1$s" on public.%1$I for update to authenticated using ((select public.is_admin())) with check ((select public.is_admin()))', t);

    execute format('drop policy if exists "Admins can delete %1$s" on public.%1$I', t);
    execute format(
      'create policy "Admins can delete %1$s" on public.%1$I for delete to authenticated using ((select public.is_admin()))', t);
  end loop;
end $$;

-- -------------------------------------------------------------
-- 5. Image storage: public bucket "media"
--    Files are served by public URL; there is deliberately no public
--    SELECT policy, so the bucket cannot be listed by visitors.
-- -------------------------------------------------------------
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'media',
  'media',
  true,
  4194304, -- 4 MB
  array['image/jpeg', 'image/png', 'image/webp', 'image/avif']
)
on conflict (id) do nothing;

drop policy if exists "Admins can upload media" on storage.objects;
create policy "Admins can upload media"
  on storage.objects for insert to authenticated
  with check (bucket_id = 'media' and (select public.is_admin()));

drop policy if exists "Admins can update media" on storage.objects;
create policy "Admins can update media"
  on storage.objects for update to authenticated
  using (bucket_id = 'media' and (select public.is_admin()))
  with check (bucket_id = 'media' and (select public.is_admin()));

drop policy if exists "Admins can delete media" on storage.objects;
create policy "Admins can delete media"
  on storage.objects for delete to authenticated
  using (bucket_id = 'media' and (select public.is_admin()));
