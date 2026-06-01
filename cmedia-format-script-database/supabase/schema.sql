create extension if not exists "pgcrypto";

create type public.app_role as enum ('admin', 'editor', 'viewer');
create type public.project_type as enum ('tv_format', 'script', 'draaiboek', 'pitchdeck');
create type public.project_status as enum ('concept', 'in_development', 'internal_review', 'sent', 'approved', 'in_production');
create type public.export_type as enum ('pdf', 'docx');

create table public.users (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null unique,
  full_name text,
  role public.app_role not null default 'editor',
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.projects (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references public.users(id) on delete cascade,
  title text not null,
  document_type public.project_type not null,
  status public.project_status not null default 'concept',
  synopsis text,
  cover_image_id uuid,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.formats (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null unique references public.projects(id) on delete cascade,
  working_title text,
  genre text,
  audience text,
  platform text,
  duration text,
  episode_count integer,
  logline text,
  short_description text,
  format_dna text,
  main_characters text,
  setting text,
  episode_structure text,
  recurring_segments text,
  visual_style text,
  tone_of_voice text,
  why_it_works text,
  commercial_opportunities text,
  production_approach text,
  future_seasons text
);

create table public.scripts (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null unique references public.projects(id) on delete cascade,
  working_title text,
  logline text,
  notes text
);

create table public.scenes (
  id uuid primary key default gen_random_uuid(),
  script_id uuid not null references public.scripts(id) on delete cascade,
  scene_number integer not null,
  title text,
  location text,
  day_night text,
  interior_exterior text,
  cast text,
  voice_over text,
  interview_questions text,
  direction_notes text,
  camera_angles text,
  audio text,
  music text,
  notes text,
  sort_order integer not null default 0
);

create table public.draaiboeken (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null unique references public.projects(id) on delete cascade,
  rows jsonb not null default '[]'::jsonb
);

create table public.pitchdecks (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null unique references public.projects(id) on delete cascade,
  cover text,
  logline text,
  program_description text,
  cast_description text,
  episode_build text,
  visual_style text,
  why_now text,
  commercial_opportunities text,
  production text,
  contact text
);

create table public.images (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  uploader_id uuid not null references public.users(id) on delete cascade,
  storage_path text not null,
  public_url text,
  alt_text text,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

alter table public.projects
  add constraint projects_cover_image_fk
  foreign key (cover_image_id) references public.images(id) on delete set null;

create table public.exports (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  requested_by uuid not null references public.users(id) on delete cascade,
  export_type public.export_type not null,
  storage_path text,
  created_at timestamptz not null default now()
);

create or replace function public.touch_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger users_touch_updated_at before update on public.users
  for each row execute procedure public.touch_updated_at();
create trigger projects_touch_updated_at before update on public.projects
  for each row execute procedure public.touch_updated_at();

create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.users (id, email, full_name)
  values (new.id, new.email, coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)));
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

alter table public.users enable row level security;
alter table public.projects enable row level security;
alter table public.formats enable row level security;
alter table public.scripts enable row level security;
alter table public.scenes enable row level security;
alter table public.draaiboeken enable row level security;
alter table public.pitchdecks enable row level security;
alter table public.images enable row level security;
alter table public.exports enable row level security;

create or replace function public.current_role()
returns public.app_role as $$
  select role from public.users where id = auth.uid();
$$ language sql stable security definer;

create policy "users can view profiles" on public.users for select using (auth.uid() is not null);
create policy "admins update profiles" on public.users for update using (public.current_role() = 'admin');

create policy "project read" on public.projects for select using (auth.uid() is not null);
create policy "project insert" on public.projects for insert with check (owner_id = auth.uid() and public.current_role() in ('admin','editor'));
create policy "project update" on public.projects for update using (public.current_role() in ('admin','editor'));
create policy "project delete" on public.projects for delete using (public.current_role() = 'admin' or owner_id = auth.uid());

create policy "format all read" on public.formats for select using (auth.uid() is not null);
create policy "format write" on public.formats for all using (public.current_role() in ('admin','editor')) with check (public.current_role() in ('admin','editor'));

create policy "script all read" on public.scripts for select using (auth.uid() is not null);
create policy "script write" on public.scripts for all using (public.current_role() in ('admin','editor')) with check (public.current_role() in ('admin','editor'));

create policy "scene all read" on public.scenes for select using (auth.uid() is not null);
create policy "scene write" on public.scenes for all using (public.current_role() in ('admin','editor')) with check (public.current_role() in ('admin','editor'));

create policy "draaiboek all read" on public.draaiboeken for select using (auth.uid() is not null);
create policy "draaiboek write" on public.draaiboeken for all using (public.current_role() in ('admin','editor')) with check (public.current_role() in ('admin','editor'));

create policy "pitchdeck all read" on public.pitchdecks for select using (auth.uid() is not null);
create policy "pitchdeck write" on public.pitchdecks for all using (public.current_role() in ('admin','editor')) with check (public.current_role() in ('admin','editor'));

create policy "images all read" on public.images for select using (auth.uid() is not null);
create policy "images write" on public.images for all using (public.current_role() in ('admin','editor')) with check (public.current_role() in ('admin','editor'));

create policy "exports all read" on public.exports for select using (auth.uid() is not null);
create policy "exports insert" on public.exports for insert with check (auth.uid() = requested_by);

create index projects_search_idx on public.projects using gin (to_tsvector('dutch', title || ' ' || coalesce(synopsis, '')));
create index projects_status_idx on public.projects(status);
create index projects_type_idx on public.projects(document_type);
create index scenes_script_order_idx on public.scenes(script_id, sort_order);
