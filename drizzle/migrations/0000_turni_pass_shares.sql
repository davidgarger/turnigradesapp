CREATE TABLE public.pass_shares (
 token text PRIMARY KEY DEFAULT encode(gen_random_bytes(32), 'hex'),
 user_id uuid NOT NULL,
 class_id text NOT NULL,
 student_id text NOT NULL,
 payload jsonb NOT NULL DEFAULT '{}'::jsonb,
 updated_at timestamptz NOT NULL DEFAULT now(),
 UNIQUE(user_id, class_id, student_id),
 CONSTRAINT pass_token_length CHECK (length(token) >= 32)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.pass_shares TO authenticated;
GRANT ALL ON public.pass_shares TO service_role;
ALTER TABLE public.pass_shares ENABLE ROW LEVEL SECURITY;
CREATE POLICY pass_shares_owner ON public.pass_shares FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE FUNCTION public.project_turni_pass(cls jsonb, student jsonb) RETURNS jsonb LANGUAGE plpgsql IMMUTABLE SET search_path = public AS $$
DECLARE device jsonb; exercise jsonb; devices jsonb := '[]'::jsonb; required jsonb; choices jsonb; item jsonb; variant text := coalesce(student->>'passVariante', 'barren'); points integer := 0; selected integer; status text;
BEGIN
 IF cls->'turniPass'->>'aktiv' IS DISTINCT FROM 'true' THEN RETURN NULL; END IF;
 FOR device IN SELECT value FROM jsonb_array_elements(cls->'turniPass'->'geraete') ORDER BY CASE value->>'id' WHEN 'reck' THEN 1 WHEN 'barren' THEN 2 WHEN 'balken' THEN 2 WHEN 'boden' THEN 3 ELSE 4 END LOOP
  IF device->>'id' NOT IN ('reck',variant,'boden','kasten') THEN CONTINUE; END IF;
  required := '[]'::jsonb; choices := '[]'::jsonb; selected := 0;
  FOR exercise IN SELECT value FROM jsonb_array_elements(device->'pflicht') LOOP
   status := coalesce(student->'passEintraege'->>(exercise->>'id'), 'offen');
   IF status NOT IN ('ok','nein') THEN status := 'offen'; END IF;
   IF status = 'ok' THEN points := points + 1; END IF;
   required := required || jsonb_build_array(jsonb_build_object('name',exercise->>'name','status',status));
  END LOOP;
  FOR exercise IN SELECT value FROM jsonb_array_elements(device->'wahl') LOOP
   IF selected >= 2 THEN EXIT; END IF;
   IF NOT (coalesce(student->'passWahl','[]'::jsonb) ? (exercise->>'id')) AND NOT (coalesce(student->'passEintraege','{}'::jsonb) ? (exercise->>'id')) THEN CONTINUE; END IF;
   selected := selected + 1;
   status := coalesce(student->'passEintraege'->>(exercise->>'id'),'offen');
   IF status NOT IN ('ok','nein') THEN status := 'offen'; END IF;
   IF status = 'ok' THEN points := points + 1; END IF;
   choices := choices || jsonb_build_array(jsonb_build_object('name',exercise->>'name','status',status));
  END LOOP;
  devices := devices || jsonb_build_array(jsonb_build_object('name',device->>'name','pflicht',required,'wahl',choices));
 END LOOP;
 RETURN jsonb_build_object('firstName',student->>'firstName','className',cls->>'name','variante',variant,'points',points,'geraete',devices);
END $$;
CREATE FUNCTION public.validate_pass_share() RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE cls jsonb; student jsonb;
BEGIN
 IF TG_OP = 'UPDATE' AND (NEW.token IS DISTINCT FROM OLD.token OR NEW.user_id IS DISTINCT FROM OLD.user_id OR NEW.class_id IS DISTINCT FROM OLD.class_id OR NEW.student_id IS DISTINCT FROM OLD.student_id) THEN RAISE EXCEPTION 'Share identity cannot change'; END IF;
 SELECT state->'classes'->NEW.class_id INTO cls FROM public.app_state WHERE user_id = NEW.user_id;
 IF cls->'turniPass'->>'linksAktiv' IS DISTINCT FROM 'true' THEN RAISE EXCEPTION 'Pass links disabled'; END IF;
 SELECT value INTO student FROM jsonb_array_elements(cls->'students') WHERE value->>'id' = NEW.student_id;
 NEW.payload := public.project_turni_pass(cls,student);
 IF student IS NULL OR NEW.payload IS NULL THEN RAISE EXCEPTION 'Pass unavailable'; END IF;
 NEW.updated_at := now(); RETURN NEW;
END $$;
CREATE TRIGGER validate_pass_share BEFORE INSERT OR UPDATE ON public.pass_shares FOR EACH ROW EXECUTE FUNCTION public.validate_pass_share();
CREATE FUNCTION public.refresh_pass_shares() RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE share record; cls jsonb; student jsonb; projection jsonb;
BEGIN
 FOR share IN SELECT token,class_id,student_id,payload FROM public.pass_shares WHERE user_id=NEW.user_id LOOP
  cls := NEW.state->'classes'->share.class_id;
  student := NULL;
  SELECT value INTO student FROM jsonb_array_elements(coalesce(cls->'students','[]'::jsonb)) WHERE value->>'id'=share.student_id;
  projection := public.project_turni_pass(cls,student);
  IF cls->'turniPass'->>'linksAktiv' IS DISTINCT FROM 'true' OR student IS NULL OR projection IS NULL THEN
   DELETE FROM public.pass_shares WHERE token=share.token;
  ELSIF share.payload IS DISTINCT FROM projection THEN
   UPDATE public.pass_shares SET payload=projection WHERE token=share.token;
  END IF;
 END LOOP;
 RETURN NEW;
END $$;
CREATE TRIGGER refresh_pass_shares AFTER INSERT OR UPDATE OF state ON public.app_state FOR EACH ROW EXECUTE FUNCTION public.refresh_pass_shares();
REVOKE ALL ON FUNCTION public.project_turni_pass(jsonb,jsonb) FROM PUBLIC,anon,authenticated;
REVOKE ALL ON FUNCTION public.validate_pass_share() FROM PUBLIC,anon,authenticated;
REVOKE ALL ON FUNCTION public.refresh_pass_shares() FROM PUBLIC,anon,authenticated;