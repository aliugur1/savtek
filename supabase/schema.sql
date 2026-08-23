create extension if not exists "uuid-ossp";

create table if not exists public.teams (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  slug text not null unique,
  category text,
  motto text,
  description text,
  contact_email text,
  contact_phone text,
  instagram text,
  created_at timestamptz not null default now()
);

create table if not exists public.profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  role text not null default 'member',
  team_id uuid references public.teams(id) on delete set null,
  created_at timestamptz not null default now()
);

create table if not exists public.team_members (
  id uuid primary key default uuid_generate_v4(),
  team_id uuid not null references public.teams(id) on delete cascade,
  full_name text not null,
  role text,
  email text,
  created_at timestamptz not null default now()
);

create table if not exists public.events (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  slug text not null unique,
  category text not null default 'Etkinlik',
  event_type text not null default 'public',
  date text,
  location text,
  excerpt text,
  description text,
  image text,
  owner_team_id uuid references public.teams(id) on delete set null,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.team_documents (
  id uuid primary key default uuid_generate_v4(),
  team_id uuid not null references public.teams(id) on delete cascade,
  title text not null,
  year text not null,
  storage_path text not null,
  file_name text not null,
  mime text not null,
  size integer not null,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now()
);

create or replace function public.current_user_role()
returns text
language sql
stable
as $$
  select coalesce((select role from public.profiles where user_id = auth.uid()), 'anonymous');
$$;

create or replace function public.current_team_id()
returns uuid
language sql
stable
as $$
  select (select team_id from public.profiles where user_id = auth.uid());
$$;

create or replace function public.is_admin()
returns boolean
language sql
stable
as $$
  select public.current_user_role() = 'admin';
$$;

alter table public.teams enable row level security;
alter table public.profiles enable row level security;
alter table public.team_members enable row level security;
alter table public.events enable row level security;
alter table public.team_documents enable row level security;

drop policy if exists "teams_read" on public.teams;
create policy "teams_read" on public.teams for select using (true);

drop policy if exists "teams_write_admin" on public.teams;
create policy "teams_write_admin" on public.teams
for all
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "profiles_read_own" on public.profiles;
create policy "profiles_read_own" on public.profiles
for select
using (auth.uid() = user_id);

drop policy if exists "profiles_upsert_own" on public.profiles;
create policy "profiles_upsert_own" on public.profiles
for insert
with check (auth.uid() = user_id);

drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own" on public.profiles
for update
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists "profiles_admin" on public.profiles;
create policy "profiles_admin" on public.profiles
for select
using (public.is_admin());

drop policy if exists "team_members_read" on public.team_members;
create policy "team_members_read" on public.team_members
for select
using (
  public.is_admin() or team_id = public.current_team_id()
);

drop policy if exists "team_members_write" on public.team_members;
create policy "team_members_write" on public.team_members
for all
using (
  public.is_admin() or team_id = public.current_team_id()
)
with check (
  public.is_admin() or team_id = public.current_team_id()
);

drop policy if exists "events_read" on public.events;
create policy "events_read" on public.events for select using (true);

drop policy if exists "events_insert" on public.events;
create policy "events_insert" on public.events
for insert
with check (
  public.is_admin()
  or (
    auth.uid() is not null
    and event_type = 'team'
    and owner_team_id = public.current_team_id()
  )
);

drop policy if exists "events_update" on public.events;
create policy "events_update" on public.events
for update
using (
  public.is_admin()
  or (created_by = auth.uid())
  or (owner_team_id = public.current_team_id())
)
with check (
  public.is_admin()
  or (created_by = auth.uid())
  or (owner_team_id = public.current_team_id())
);

drop policy if exists "events_delete" on public.events;
create policy "events_delete" on public.events
for delete
using (
  public.is_admin()
  or (created_by = auth.uid())
  or (owner_team_id = public.current_team_id())
);

drop policy if exists "team_documents_read" on public.team_documents;
create policy "team_documents_read" on public.team_documents
for select
using (public.is_admin() or team_id = public.current_team_id());

drop policy if exists "team_documents_write" on public.team_documents;
create policy "team_documents_write" on public.team_documents
for all
using (public.is_admin() or team_id = public.current_team_id())
with check (public.is_admin() or team_id = public.current_team_id());

insert into storage.buckets (id, name, public)
values ('team-documents', 'team-documents', false)
on conflict (id) do nothing;

-- ─── Site content tables ────────────────────────────────────────────────────

create table if not exists public.site_teams (
  id text primary key default gen_random_uuid()::text,
  name text not null,
  slug text not null unique,
  area text,
  image text,
  badge text default 'Aktif Takım',
  description text,
  sort_order integer default 999,
  featured boolean default false,
  members jsonb default '[]',
  achievements jsonb default '[]',
  technologies jsonb default '[]',
  gallery jsonb default '[]',
  sponsors jsonb default '[]',
  deleted boolean default false,
  deleted_at timestamptz,
  created_at timestamptz default now()
);

create table if not exists public.site_events (
  id text primary key default gen_random_uuid()::text,
  title text not null,
  slug text not null unique,
  category text default 'Seminer',
  date text,
  time text,
  location text,
  location_link text,
  excerpt text,
  description text,
  image text,
  main_image text,
  speakers jsonb default '[]',
  program jsonb default '[]',
  gallery jsonb default '[]',
  deleted boolean default false,
  deleted_at timestamptz,
  created_at timestamptz default now()
);

create table if not exists public.site_ekip (
  id text primary key default gen_random_uuid()::text,
  name text not null,
  role text,
  coordination_title text,
  department text,
  photo text,
  instagram text,
  linkedin text,
  category text default 'Yönetim',
  sort_order integer default 999,
  deleted boolean default false,
  deleted_at timestamptz,
  created_at timestamptz default now()
);

create table if not exists public.site_sponsors (
  id text primary key default gen_random_uuid()::text,
  name text not null,
  logo text,
  website text,
  instagram text,
  linkedin text,
  sort_order integer default 999,
  deleted boolean default false,
  deleted_at timestamptz,
  created_at timestamptz default now()
);

create table if not exists public.site_logs (
  id text primary key,
  action text not null,
  entity text,
  entity_id text,
  user_id text,
  changes jsonb,
  user_agent text,
  created_at timestamptz default now()
);

create table if not exists public.site_announcements (
  id text primary key default gen_random_uuid()::text,
  title text not null,
  content text,
  type text default 'info',
  active boolean default true,
  pinned boolean default false,
  expires_at timestamptz,
  deleted boolean default false,
  deleted_at timestamptz,
  created_at timestamptz default now()
);

create table if not exists public.site_applications (
  id text primary key default gen_random_uuid()::text,
  name text not null,
  email text not null,
  department text,
  team_interest text,
  motivation text,
  status text default 'beklemede',
  notes text,
  created_at timestamptz default now()
);

create table if not exists public.site_projects (
  id text primary key default gen_random_uuid()::text,
  title text not null,
  slug text unique,
  team text,
  category text,
  description text,
  image text,
  technologies jsonb default '[]',
  achievements jsonb default '[]',
  links jsonb default '{}',
  year text,
  featured boolean default false,
  sort_order integer default 999,
  deleted boolean default false,
  deleted_at timestamptz,
  created_at timestamptz default now()
);

create table if not exists public.site_gallery (
  id text primary key default gen_random_uuid()::text,
  title text,
  desc text,
  img text not null,
  category text,
  sort_order integer default 999,
  deleted boolean default false,
  deleted_at timestamptz,
  created_at timestamptz default now()
);

create table if not exists public.site_settings (
  key text primary key,
  value jsonb not null
);

-- RLS for site content tables
alter table public.site_teams enable row level security;
alter table public.site_events enable row level security;
alter table public.site_ekip enable row level security;
alter table public.site_sponsors enable row level security;
alter table public.site_announcements enable row level security;
alter table public.site_applications enable row level security;
alter table public.site_projects enable row level security;
alter table public.site_gallery enable row level security;
alter table public.site_logs enable row level security;
alter table public.site_settings enable row level security;

create policy "site_teams_read" on public.site_teams for select using (true);
create policy "site_teams_write" on public.site_teams for all using (public.is_admin()) with check (public.is_admin());

create policy "site_events_read" on public.site_events for select using (true);
create policy "site_events_write" on public.site_events for all using (public.is_admin()) with check (public.is_admin());

create policy "site_ekip_read" on public.site_ekip for select using (true);
create policy "site_ekip_write" on public.site_ekip for all using (public.is_admin()) with check (public.is_admin());

create policy "site_sponsors_read" on public.site_sponsors for select using (true);
create policy "site_sponsors_write" on public.site_sponsors for all using (public.is_admin()) with check (public.is_admin());

create policy "site_announcements_read" on public.site_announcements for select using (true);
create policy "site_announcements_write" on public.site_announcements for all using (public.is_admin()) with check (public.is_admin());

create policy "site_applications_insert" on public.site_applications for insert with check (true);
create policy "site_applications_read" on public.site_applications for select using (public.is_admin());
create policy "site_applications_update" on public.site_applications for update using (public.is_admin()) with check (public.is_admin());
create policy "site_applications_delete" on public.site_applications for delete using (public.is_admin());

create policy "site_projects_read" on public.site_projects for select using (true);
create policy "site_projects_write" on public.site_projects for all using (public.is_admin()) with check (public.is_admin());

create policy "site_gallery_read" on public.site_gallery for select using (true);
create policy "site_gallery_write" on public.site_gallery for all using (public.is_admin()) with check (public.is_admin());

create policy "site_logs_write" on public.site_logs for insert with check (public.is_admin());
create policy "site_logs_read" on public.site_logs for select using (public.is_admin());

create policy "site_settings_read" on public.site_settings for select using (true);
create policy "site_settings_write" on public.site_settings for all using (public.is_admin()) with check (public.is_admin());

alter table storage.objects enable row level security;

drop policy if exists "team_docs_select" on storage.objects;
create policy "team_docs_select" on storage.objects
for select
using (
  bucket_id = 'team-documents'
  and (
    public.is_admin()
    or split_part(name, '/', 2)::uuid = public.current_team_id()
  )
);

drop policy if exists "team_docs_insert" on storage.objects;
create policy "team_docs_insert" on storage.objects
for insert
with check (
  bucket_id = 'team-documents'
  and (
    public.is_admin()
    or split_part(name, '/', 2)::uuid = public.current_team_id()
  )
);

drop policy if exists "team_docs_update" on storage.objects;
create policy "team_docs_update" on storage.objects
for update
using (
  bucket_id = 'team-documents'
  and (
    public.is_admin()
    or split_part(name, '/', 2)::uuid = public.current_team_id()
  )
);

drop policy if exists "team_docs_delete" on storage.objects;
create policy "team_docs_delete" on storage.objects
for delete
using (
  bucket_id = 'team-documents'
  and (
    public.is_admin()
    or split_part(name, '/', 2)::uuid = public.current_team_id()
  )
);
