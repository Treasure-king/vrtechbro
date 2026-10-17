-- Point service illustrations at the optimised files in /images/services/.
--
-- The site already maps the old paths in code (lib/images.ts → serviceImage),
-- so running this is optional, but it keeps the data and the files in sync.
-- Run once in the Supabase dashboard: SQL Editor → New query → paste → Run.
-- Safe to run more than once: it only touches rows still on the old pattern.

update public.services
set image_url = '/images/services/'
  || regexp_replace(image_url, '^/images/([a-z0-9-]+)\.(png|webp)$', '\1')
  || '.webp'
where image_url ~ '^/images/[a-z0-9-]+\.(png|webp)$';
