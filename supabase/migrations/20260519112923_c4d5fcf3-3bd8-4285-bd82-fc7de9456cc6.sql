create table public.feedback (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  kind text not null check (kind in ('verbesserung','fehler','sonstiges')),
  message text not null check (char_length(message) between 3 and 4000),
  contact_email text,
  page text,
  user_agent text,
  created_at timestamptz not null default now()
);

alter table public.feedback enable row level security;

-- Jeder eingeloggte Nutzer darf Feedback einreichen
create policy "feedback_insert_authenticated"
on public.feedback for insert
to authenticated
with check (auth.uid() is not null);

-- Nur eigenes Feedback lesbar (Datenschutz)
create policy "feedback_select_own"
on public.feedback for select
to authenticated
using (user_id = auth.uid());

create index feedback_created_at_idx on public.feedback (created_at desc);