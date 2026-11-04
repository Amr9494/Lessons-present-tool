-- ═══════════════════════════════════════════════════════════════
--  Upgrade v6 — videos and animations inside slides.
--  Lets the "media" storage accept video files (MP4, WebM, MOV) up to 50 MB.
--  Supabase → SQL Editor → New query → paste → Run.
--  SAFE: only changes the limits of the "media" bucket. Nothing is deleted.
--  (Run upgrade-v4.sql first if you have not.)
-- ═══════════════════════════════════════════════════════════════

update storage.buckets
   set file_size_limit = 52428800,
       allowed_mime_types = array['audio/*', 'image/*', 'video/*']
 where id = 'media';
