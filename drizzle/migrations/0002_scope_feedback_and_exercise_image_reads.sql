ALTER POLICY feedback_insert_authenticated ON public.feedback TO authenticated WITH CHECK ((SELECT auth.uid()) = user_id);
ALTER POLICY "exercise images public read" ON storage.objects TO authenticated USING (
 bucket_id = 'exercise-uploads' AND (
 (storage.foldername(name))[1] = (SELECT auth.uid())::text
 OR public.has_role((SELECT auth.uid()), 'admin'::public.app_role)
 OR EXISTS (
 SELECT 1 FROM public.community_exercises e,
 LATERAL jsonb_array_elements_text(e.images) image
 WHERE e.status = 'approved'
 AND (image = storage.objects.name OR right(split_part(image, '?', 1), length('/exercise-uploads/' || storage.objects.name)) = '/exercise-uploads/' || storage.objects.name)
 )
 )
);