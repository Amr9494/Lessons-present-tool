-- ═══════════════════════════════════════════════════════════════
--  Upgrade v2 — adds YouTube links per lesson and an icon per topic.
--  Supabase → SQL Editor → New query → paste → Run.
--
--  SAFE: it only ADDS two optional columns. It does not delete,
--  rename or change any existing topic, lesson or PDF.
--  Running it twice does nothing the second time.
-- ═══════════════════════════════════════════════════════════════

alter table public.lessons add column if not exists videos jsonb not null default '{}'::jsonb;
alter table public.topics  add column if not exists icon   text;
