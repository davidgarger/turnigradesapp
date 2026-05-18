
insert into storage.buckets (id, name, public)
values ('excuses', 'excuses', false)
on conflict (id) do nothing;

create policy "Users can view their own excuse files"
on storage.objects for select
to authenticated
using (bucket_id = 'excuses' and auth.uid()::text = (storage.foldername(name))[1]);

create policy "Users can upload their own excuse files"
on storage.objects for insert
to authenticated
with check (bucket_id = 'excuses' and auth.uid()::text = (storage.foldername(name))[1]);

create policy "Users can update their own excuse files"
on storage.objects for update
to authenticated
using (bucket_id = 'excuses' and auth.uid()::text = (storage.foldername(name))[1]);

create policy "Users can delete their own excuse files"
on storage.objects for delete
to authenticated
using (bucket_id = 'excuses' and auth.uid()::text = (storage.foldername(name))[1]);
