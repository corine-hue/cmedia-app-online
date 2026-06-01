insert into storage.buckets (id, name, public)
values ('project-images', 'project-images', true)
on conflict (id) do nothing;

insert into storage.buckets (id, name, public)
values ('project-exports', 'project-exports', false)
on conflict (id) do nothing;

create policy "authenticated image read" on storage.objects
  for select using (bucket_id = 'project-images' and auth.uid() is not null);

create policy "editors image upload" on storage.objects
  for insert with check (bucket_id = 'project-images' and public.current_role() in ('admin','editor'));

create policy "editors image update" on storage.objects
  for update using (bucket_id = 'project-images' and public.current_role() in ('admin','editor'));

create policy "export owner read" on storage.objects
  for select using (bucket_id = 'project-exports' and auth.uid() is not null);

create policy "export create" on storage.objects
  for insert with check (bucket_id = 'project-exports' and auth.uid() is not null);
