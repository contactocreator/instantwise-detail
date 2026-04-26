-- Organizations
create table public.organizations (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  created_at timestamptz default now()
);

-- User profiles (linked to auth.users)
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  org_id uuid references public.organizations(id) on delete cascade,
  email text,
  role text default 'editor' check (role in ('admin', 'editor', 'viewer')),
  created_at timestamptz default now()
);

-- Projects
create table public.projects (
  id uuid primary key default gen_random_uuid(),
  org_id uuid references public.organizations(id) on delete cascade,
  user_id uuid references auth.users(id) on delete set null,
  name text not null,
  created_at timestamptz default now()
);

-- Creatives
create table public.creatives (
  id uuid primary key default gen_random_uuid(),
  project_id uuid references public.projects(id) on delete cascade,
  name text not null default '새 광고 소재',
  status text default 'draft' check (status in ('draft', 'analyzing', 'copy_ready', 'generating', 'completed')),
  product_image_url text,
  reference_image_url text,
  product_info text,
  layers jsonb,
  copies jsonb,
  selected_copies jsonb,
  generated_images jsonb,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Enable RLS
alter table public.organizations enable row level security;
alter table public.profiles enable row level security;
alter table public.projects enable row level security;
alter table public.creatives enable row level security;

-- RLS Policies
create policy "Users can view their own profile"
  on public.profiles for select using (auth.uid() = id);

create policy "Users can view their org"
  on public.organizations for select
  using (id in (select org_id from public.profiles where id = auth.uid()));

create policy "Users can manage their projects"
  on public.projects for all
  using (user_id = auth.uid());

create policy "Users can manage creatives in their projects"
  on public.creatives for all
  using (project_id in (select id from public.projects where user_id = auth.uid()));

-- Auto-create org and profile on signup
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public
as $$
declare
  new_org_id uuid;
begin
  insert into public.organizations (name)
  values (coalesce(new.raw_user_meta_data->>'org_name', 'My Organization'))
  returning id into new_org_id;

  insert into public.profiles (id, org_id, email, role)
  values (new.id, new_org_id, new.email, 'admin');

  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
