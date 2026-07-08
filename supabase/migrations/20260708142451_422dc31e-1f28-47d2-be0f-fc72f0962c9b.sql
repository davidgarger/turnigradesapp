
ALTER TABLE public.community_exercises
  ADD COLUMN IF NOT EXISTS category text NOT NULL DEFAULT 'kondition';

ALTER TABLE public.community_exercises
  DROP CONSTRAINT IF EXISTS community_exercises_category_check;

ALTER TABLE public.community_exercises
  ADD CONSTRAINT community_exercises_category_check
  CHECK (category IN ('kondition','stationenkarten'));

CREATE INDEX IF NOT EXISTS community_exercises_category_status_idx
  ON public.community_exercises (category, status);
