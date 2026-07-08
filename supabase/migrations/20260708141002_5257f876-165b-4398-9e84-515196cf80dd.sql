
-- Enum for roles
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

-- user_roles
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "users read own roles"
ON public.user_roles FOR SELECT TO authenticated
USING (auth.uid() = user_id);

-- has_role security definer
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role public.app_role)
RETURNS BOOLEAN
LANGUAGE SQL STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role);
$$;

-- Trigger: auto-assign admin to specific email on signup; everyone else gets 'user'
CREATE OR REPLACE FUNCTION public.handle_new_user_role()
RETURNS TRIGGER
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  IF NEW.email = 'davidgarger8@gmail.com' THEN
    INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'admin')
    ON CONFLICT DO NOTHING;
  END IF;
  INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'user')
  ON CONFLICT DO NOTHING;
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created_role
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user_role();

-- Backfill for existing users
INSERT INTO public.user_roles (user_id, role)
SELECT id, 'user' FROM auth.users
ON CONFLICT DO NOTHING;

INSERT INTO public.user_roles (user_id, role)
SELECT id, 'admin' FROM auth.users WHERE email = 'davidgarger8@gmail.com'
ON CONFLICT DO NOTHING;

-- Community exercises
CREATE TABLE public.community_exercises (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_by UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','approved','rejected')),
  title TEXT NOT NULL,
  subcategory TEXT NOT NULL,
  short_description TEXT NOT NULL,
  goal TEXT NOT NULL,
  steps JSONB NOT NULL DEFAULT '[]'::jsonb,
  duration TEXT NOT NULL,
  duration_minutes INT NOT NULL DEFAULT 10,
  group_size TEXT NOT NULL,
  material TEXT,
  age_group TEXT NOT NULL,
  age_min INT NOT NULL DEFAULT 8,
  age_max INT NOT NULL DEFAULT 14,
  difficulty TEXT NOT NULL,
  images JSONB NOT NULL DEFAULT '[]'::jsonb,
  video_url TEXT,
  author_name TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.community_exercises TO authenticated;
GRANT ALL ON public.community_exercises TO service_role;
ALTER TABLE public.community_exercises ENABLE ROW LEVEL SECURITY;

-- Read: approved OR own OR admin
CREATE POLICY "read approved or own or admin"
ON public.community_exercises FOR SELECT TO authenticated
USING (
  status = 'approved'
  OR created_by = auth.uid()
  OR public.has_role(auth.uid(), 'admin')
);

-- Insert: eingeloggt, created_by = self, status pending
CREATE POLICY "insert own pending"
ON public.community_exercises FOR INSERT TO authenticated
WITH CHECK (created_by = auth.uid() AND status = 'pending');

-- Update: eigener Eintrag (nur wenn noch pending) ODER admin (jede)
CREATE POLICY "update own pending or admin"
ON public.community_exercises FOR UPDATE TO authenticated
USING (
  (created_by = auth.uid() AND status = 'pending')
  OR public.has_role(auth.uid(), 'admin')
)
WITH CHECK (
  (created_by = auth.uid() AND status = 'pending')
  OR public.has_role(auth.uid(), 'admin')
);

-- Delete: own or admin
CREATE POLICY "delete own or admin"
ON public.community_exercises FOR DELETE TO authenticated
USING (created_by = auth.uid() OR public.has_role(auth.uid(), 'admin'));

-- updated_at trigger
CREATE OR REPLACE FUNCTION public.tg_touch_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql SET search_path = public AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;
CREATE TRIGGER tg_community_exercises_touch
BEFORE UPDATE ON public.community_exercises
FOR EACH ROW EXECUTE FUNCTION public.tg_touch_updated_at();

-- Favorites
CREATE TABLE public.exercise_favorites (
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  exercise_id TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, exercise_id)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.exercise_favorites TO authenticated;
GRANT ALL ON public.exercise_favorites TO service_role;
ALTER TABLE public.exercise_favorites ENABLE ROW LEVEL SECURITY;

CREATE POLICY "own favorites all"
ON public.exercise_favorites FOR ALL TO authenticated
USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());
