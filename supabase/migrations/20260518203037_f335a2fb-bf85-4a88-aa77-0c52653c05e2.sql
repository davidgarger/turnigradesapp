create table public.user_prefs (
  user_id uuid primary key references auth.users(id) on delete cascade,
  logo text,
  themes jsonb not null default '{}'::jsonb,
  visible_classes jsonb not null default '["1","2","3","4"]'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.user_prefs enable row level security;

create policy "user_prefs select own" on public.user_prefs for select to authenticated using (auth.uid() = user_id);
create policy "user_prefs insert own" on public.user_prefs for insert to authenticated with check (auth.uid() = user_id);
create policy "user_prefs update own" on public.user_prefs for update to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "user_prefs delete own" on public.user_prefs for delete to authenticated using (auth.uid() = user_id);

create trigger trg_user_prefs_updated_at
before update on public.user_prefs
for each row execute function public.touch_app_state_updated_at();