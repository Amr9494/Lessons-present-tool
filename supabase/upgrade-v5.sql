-- ═══════════════════════════════════════════════════════════════
--  Upgrade v5 — drafts: folders and lessons can be kept hidden
--  ("coming soon") until an admin presses Publish.
--  Supabase → SQL Editor → New query → paste → Run.
--
--  SAFE: it only ADDS one column to each table. Everything that is
--  already on the site stays published. Running it twice does nothing.
-- ═══════════════════════════════════════════════════════════════

alter table public.topics  add column if not exists draft boolean not null default false;
alter table public.lessons add column if not exists draft boolean not null default false;
