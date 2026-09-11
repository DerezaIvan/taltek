BEGIN;

ALTER TABLE public.submissions
  ADD COLUMN IF NOT EXISTS okpo varchar(255);

ALTER TABLE public.blocked_submissions
  ADD COLUMN IF NOT EXISTS okpo varchar(255);

COMMIT;
