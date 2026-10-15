-- =============================================================
-- Careers: jobs table
-- How to run: Supabase dashboard -> SQL Editor -> New query ->
-- paste this whole file -> Run. Safe to run once; it creates the
-- table, locks it down with row-level security and seeds the three
-- roles that are currently hard-coded on /careers.
-- Manage roles afterwards in Table Editor -> jobs (set is_open to
-- false to hide a role without deleting it).
-- =============================================================

create table if not exists public.jobs (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  location text not null,
  type text not null,              -- e.g. 'Full-time', 'Contract'
  description text not null,
  is_open boolean not null default true,
  display_order int default 0,
  date_posted date not null default current_date,
  valid_through date,
  created_at timestamptz default now()
);

alter table public.jobs enable row level security;

-- Public visitors may only read open roles. No insert/update/delete
-- policies exist, so the anon key cannot modify this table.
drop policy if exists "Public can read open jobs" on public.jobs;
create policy "Public can read open jobs"
  on public.jobs
  for select
  to anon, authenticated
  using (is_open = true);

insert into public.jobs (slug, title, location, type, description, display_order)
values
  (
    'frontend-developer',
    'Frontend Developer',
    'Remote / India',
    'Full-time',
    'We are looking for a skilled Frontend Developer with strong experience in React, Next.js, and TailwindCSS. You will work on scalable client projects and deliver beautiful UIs.',
    1
  ),
  (
    'backend-developer',
    'Backend Developer',
    'Remote / India',
    'Full-time',
    'Seeking a Backend Developer experienced with Node.js, Express, and MongoDB. Knowledge of microservices and APIs is a big plus.',
    2
  ),
  (
    'ui-ux-designer',
    'UI/UX Designer',
    'Remote / Hybrid',
    'Contract',
    'We are looking for creative UI/UX Designers who can turn requirements into intuitive interfaces. Familiarity with Figma and Tailwind design systems is preferred.',
    3
  )
on conflict (slug) do nothing;
