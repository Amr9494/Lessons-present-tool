-- ═══════════════════════════════════════════════════════════════
--  Lesson Present Tool — database setup
--  Paste ALL of this into Supabase → SQL Editor → New query → Run.
--  Safe to run again: it only creates what is missing.
-- ═══════════════════════════════════════════════════════════════

-- Topic folders. One row per folder; names hold all three languages:
--   {"ar": "الأخلاق", "en": "Morals", "fi": "Tavat"}
create table if not exists public.topics (
  id          uuid primary key default gen_random_uuid(),
  names       jsonb not null default '{}'::jsonb,
  icon        text,
  sort        int   not null default 0,
  created_at  timestamptz not null default now()
);

-- Lessons. titles = names in 3 languages.
-- files = one PDF per language:
--   {"en": {"path": "<lesson-id>/en-123.pdf", "pages": 24}, "ar": {...}}
create table if not exists public.lessons (
  id          uuid primary key default gen_random_uuid(),
  topic_id    uuid not null references public.topics(id) on delete cascade,
  titles      jsonb not null default '{}'::jsonb,
  files       jsonb not null default '{}'::jsonb,
  videos      jsonb not null default '{}'::jsonb,
  sort        int   not null default 0,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);
-- (older installs: columns added by upgrade-v2.sql)
alter table public.lessons add column if not exists videos jsonb not null default '{}'::jsonb;
alter table public.topics  add column if not exists icon text;
alter table public.lessons add column if not exists quiz jsonb not null default '{}'::jsonb;
create index if not exists lessons_topic_idx on public.lessons(topic_id);

-- Who is allowed to edit. Add people here (see README step 4).
create table if not exists public.admins (
  user_id  uuid primary key references auth.users(id) on delete cascade,
  added_at timestamptz not null default now()
);

create or replace function public.is_admin()
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.admins where user_id = auth.uid());
$$;

-- ── Row level security: everyone reads, only admins write ──
alter table public.topics  enable row level security;
alter table public.lessons enable row level security;
alter table public.admins  enable row level security;

drop policy if exists "topics read"   on public.topics;
drop policy if exists "topics write"  on public.topics;
drop policy if exists "lessons read"  on public.lessons;
drop policy if exists "lessons write" on public.lessons;
drop policy if exists "admins self"   on public.admins;

create policy "topics read"   on public.topics  for select using (true);
create policy "topics write"  on public.topics  for all to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "lessons read"  on public.lessons for select using (true);
create policy "lessons write" on public.lessons for all to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "admins self"   on public.admins  for select to authenticated using (user_id = auth.uid());

-- ── Editable website texts ──
create table if not exists public.settings (
  key text primary key, value jsonb not null default '{}'::jsonb, updated_at timestamptz not null default now()
);
alter table public.settings enable row level security;
drop policy if exists "settings read"  on public.settings;
drop policy if exists "settings write" on public.settings;
create policy "settings read"  on public.settings for select using (true);
create policy "settings write" on public.settings for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- ── File storage for the PDFs (public to read, admins to write) ──
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('lessons', 'lessons', true, 52428800, array['application/pdf'])
on conflict (id) do update set public = true, allowed_mime_types = array['application/pdf'];

drop policy if exists "lesson pdf insert" on storage.objects;
drop policy if exists "lesson pdf update" on storage.objects;
drop policy if exists "lesson pdf delete" on storage.objects;

create policy "lesson pdf insert" on storage.objects for insert to authenticated
  with check (bucket_id = 'lessons' and public.is_admin());
create policy "lesson pdf update" on storage.objects for update to authenticated
  using (bucket_id = 'lessons' and public.is_admin());
create policy "lesson pdf delete" on storage.objects for delete to authenticated
  using (bucket_id = 'lessons' and public.is_admin());

-- ── Make someone an admin (run after creating their user) ──
-- insert into public.admins (user_id)
--   select id from auth.users where email = 'teacher@example.com'
-- on conflict do nothing;
