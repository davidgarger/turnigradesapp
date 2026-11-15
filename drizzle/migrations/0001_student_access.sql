CREATE TABLE public.student_access (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
 user_id uuid NOT NULL,
 class_id text NOT NULL,
 student_id text NOT NULL,
 code_hash text NOT NULL UNIQUE,
 created_at timestamptz NOT NULL DEFAULT now(),
 UNIQUE(user_id, student_id)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.student_access TO authenticated;
GRANT ALL ON public.student_access TO service_role;
ALTER TABLE public.student_access ENABLE ROW LEVEL SECURITY;
CREATE POLICY owner_access ON public.student_access TO authenticated USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());
CREATE TABLE public.student_sessions (
 token_hash text PRIMARY KEY,
 access_id uuid NOT NULL REFERENCES public.student_access(id) ON DELETE CASCADE,
 expires_at timestamptz NOT NULL
);
GRANT ALL ON public.student_sessions TO service_role;
ALTER TABLE public.student_sessions ENABLE ROW LEVEL SECURITY;
CREATE TABLE public.student_login_limits (
 key text PRIMARY KEY,
 attempts integer NOT NULL DEFAULT 0,
 window_start timestamptz NOT NULL DEFAULT now()
);
GRANT ALL ON public.student_login_limits TO service_role;
ALTER TABLE public.student_login_limits ENABLE ROW LEVEL SECURITY;
CREATE OR REPLACE FUNCTION public.take_student_login_attempt(p_key text) RETURNS boolean
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE n integer;
BEGIN
 INSERT INTO public.student_login_limits(key, attempts, window_start) VALUES(p_key, 1, now())
 ON CONFLICT(key) DO UPDATE SET
 attempts = CASE WHEN student_login_limits.window_start < now() - interval '15 minutes' THEN 1 ELSE student_login_limits.attempts + 1 END,
 window_start = CASE WHEN student_login_limits.window_start < now() - interval '15 minutes' THEN now() ELSE student_login_limits.window_start END
 RETURNING attempts INTO n;
 DELETE FROM public.student_login_limits WHERE window_start < now() - interval '1 day';
 RETURN n <= 20;
END;
$$;
REVOKE ALL ON FUNCTION public.take_student_login_attempt(text) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.take_student_login_attempt(text) TO service_role;
CREATE OR REPLACE FUNCTION public.validate_student_access() RETURNS trigger
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
 IF NOT EXISTS(SELECT 1 FROM public.app_state a, LATERAL jsonb_array_elements(a.state->'classes'->NEW.class_id->'students') s WHERE a.user_id = NEW.user_id AND s->>'id' = NEW.student_id) THEN
 RAISE EXCEPTION 'Student does not belong to class';
 END IF;
 IF TG_OP = 'UPDATE' AND OLD.code_hash IS DISTINCT FROM NEW.code_hash THEN
 DELETE FROM public.student_sessions WHERE access_id = OLD.id;
 END IF;
 RETURN NEW;
END;
$$;
CREATE TRIGGER validate_student_access BEFORE INSERT OR UPDATE ON public.student_access FOR EACH ROW EXECUTE FUNCTION public.validate_student_access();
CREATE OR REPLACE FUNCTION public.sync_student_access() RETURNS trigger
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE r record; target text;
BEGIN
 FOR r IN SELECT id, student_id FROM public.student_access WHERE user_id = NEW.user_id LOOP
 SELECT c.key INTO target FROM jsonb_each(NEW.state->'classes') c, LATERAL jsonb_array_elements(c.value->'students') s WHERE s->>'id' = r.student_id LIMIT 1;
 IF target IS NULL THEN
 DELETE FROM public.student_access WHERE id = r.id;
 ELSE
 UPDATE public.student_access SET class_id = target WHERE id = r.id AND class_id IS DISTINCT FROM target;
 END IF;
 END LOOP;
 RETURN NEW;
END;
$$;
CREATE TRIGGER sync_student_access AFTER UPDATE OF state ON public.app_state FOR EACH ROW EXECUTE FUNCTION public.sync_student_access();