
-- Storage policies for exercise-uploads bucket
-- Public read (bucket is private, aber alle dürfen SELECT lesen -> Bilder sind für alle sichtbar)
CREATE POLICY "exercise images public read"
ON storage.objects FOR SELECT
USING (bucket_id = 'exercise-uploads');

CREATE POLICY "authenticated upload exercise images"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'exercise-uploads' AND (storage.foldername(name))[1] = auth.uid()::text);

CREATE POLICY "own delete exercise images"
ON storage.objects FOR DELETE TO authenticated
USING (bucket_id = 'exercise-uploads' AND (storage.foldername(name))[1] = auth.uid()::text);

-- Härten der SECURITY DEFINER Funktionen
REVOKE EXECUTE ON FUNCTION public.handle_new_user_role() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.tg_touch_updated_at() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.has_role(UUID, public.app_role) FROM PUBLIC, anon;
