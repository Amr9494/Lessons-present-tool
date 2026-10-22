-- ═══════════════════════════════════════════════════════════════
--  Upgrade v4 — storage for pictures and sounds (Arabic letters journey).
--  Supabase → SQL Editor → New query → paste → Run.
--
--  SAFE: it only ADDS a new public storage bucket called "media".
--  Nothing existing is changed. Running it twice does nothing the second time.
--  (Needs upgrade-v3.sql to have been run first — the journey's texts are saved in its "settings" table.)
-- ═══════════════════════════════════════════════════════════════

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('media', 'media', true, 20971520, array['audio/*', 'image/*', 'video/webm'])
on conflict (id) do update set public = true, file_size_limit = 20971520, allowed_mime_types = array['audio/*', 'image/*', 'video/webm'];

drop policy if exists "media insert" on storage.objects;
drop policy if exists "media update" on storage.objects;
drop policy if exists "media delete" on storage.objects;

create policy "media insert" on storage.objects for insert to authenticated
  with check (bucket_id = 'media' and public.is_admin());
create policy "media update" on storage.objects for update to authenticated
  using (bucket_id = 'media' and public.is_admin());
create policy "media delete" on storage.objects for delete to authenticated
  using (bucket_id = 'media' and public.is_admin());
