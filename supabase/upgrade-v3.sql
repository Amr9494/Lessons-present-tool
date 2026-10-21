-- ═══════════════════════════════════════════════════════════════
--  Upgrade v3 — adds quizzes per lesson and editable website texts.
--  Supabase → SQL Editor → New query → paste → Run.
--
--  SAFE: it only ADDS one optional column and one new table.
--  It does not delete, rename or change any topic, lesson or PDF.
--  Running it twice does nothing the second time.
-- ═══════════════════════════════════════════════════════════════

alter table public.lessons add column if not exists quiz jsonb not null default '{}'::jsonb;

create table if not exists public.settings (
  key        text primary key,
  value      jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.settings enable row level security;
drop policy if exists "settings read"  on public.settings;
drop policy if exists "settings write" on public.settings;
create policy "settings read"  on public.settings for select using (true);
create policy "settings write" on public.settings for all to authenticated using (public.is_admin()) with check (public.is_admin());
