-- ============================================================
-- CareerAI — Supabase SQL Schema
-- Supabase Dashboard → SQL Editor'a yapıştırıp çalıştırın
-- ============================================================

-- -----------------------------------------------
-- 1. profiles (kullanıcı profilleri)
-- -----------------------------------------------
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade not null primary key,
  full_name text,
  email text,
  avatar_url text,
  plan text default 'free' not null check (plan in ('free', 'pro')),
  language text default 'tr' not null check (language in ('tr', 'en')),
  stripe_customer_id text,
  subscription_status text default 'inactive',
  created_at timestamp with time zone default now() not null,
  updated_at timestamp with time zone default now() not null
);

-- RLS
alter table public.profiles enable row level security;
create policy "Users can view own profile"  on public.profiles for select using (auth.uid() = id);
create policy "Users can update own profile" on public.profiles for update using (auth.uid() = id);

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, full_name, email)
  values (
    new.id,
    new.raw_user_meta_data ->> 'full_name',
    new.email
  );
  
  insert into public.usage_quotas (user_id)
  values (new.id);
  
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- -----------------------------------------------
-- 2. cvs (CV'ler)
-- -----------------------------------------------
create table if not exists public.cvs (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  title text not null default 'Yeni CV',
  template text not null default 'classic' check (template in ('classic', 'modern', 'minimal')),
  data jsonb not null default '{}'::jsonb,
  ats_score integer,
  is_public boolean default false,
  created_at timestamp with time zone default now() not null,
  updated_at timestamp with time zone default now() not null
);

-- RLS
alter table public.cvs enable row level security;
create policy "Users can manage own CVs" on public.cvs for all using (auth.uid() = user_id);

-- -----------------------------------------------
-- 3. cover_letters (motivasyon mektupları)
-- -----------------------------------------------
create table if not exists public.cover_letters (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  title text not null default 'Yeni Mektup',
  position text,
  company text,
  language text default 'tr',
  tone text default 'professional',
  content text,
  created_at timestamp with time zone default now() not null,
  updated_at timestamp with time zone default now() not null
);

-- RLS
alter table public.cover_letters enable row level security;
create policy "Users can manage own cover letters" on public.cover_letters for all using (auth.uid() = user_id);

-- -----------------------------------------------
-- 4. job_listings (başvuru takibi için ilanlar)
-- -----------------------------------------------
create table if not exists public.job_listings (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  title text not null,
  company text,
  location text,
  url text,
  raw_text text,
  analysis jsonb,
  status text default 'applied' check (status in ('applied', 'waiting', 'interview', 'offer', 'rejected')),
  applied_at date default current_date,
  created_at timestamp with time zone default now() not null
);

-- RLS
alter table public.job_listings enable row level security;
create policy "Users can manage own job listings" on public.job_listings for all using (auth.uid() = user_id);

-- -----------------------------------------------
-- 5. usage_quotas (kota takibi)
-- -----------------------------------------------
create table if not exists public.usage_quotas (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null unique,
  cv_count integer default 0,
  letter_count integer default 0,
  analysis_count integer default 0,
  reset_at timestamp with time zone default date_trunc('month', now()) + interval '1 month',
  updated_at timestamp with time zone default now()
);

-- RLS
alter table public.usage_quotas enable row level security;
create policy "Users can view own quotas" on public.usage_quotas for select using (auth.uid() = user_id);
create policy "Service role can update quotas" on public.usage_quotas for all using (true) with check (true);

-- -----------------------------------------------
-- Yardımcı: updated_at otomatik güncelleme
-- -----------------------------------------------
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end;
$$;

create trigger set_cvs_updated_at before update on public.cvs
  for each row execute procedure public.set_updated_at();

create trigger set_cover_letters_updated_at before update on public.cover_letters
  for each row execute procedure public.set_updated_at();

create trigger set_profiles_updated_at before update on public.profiles
  for each row execute procedure public.set_updated_at();

-- -----------------------------------------------
-- 6. skills_analysis (AI beceri analizi)
-- -----------------------------------------------
create table if not exists public.skills_analysis (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  scores jsonb not null,
  overall_score integer not null,
  insight text,
  recommendations jsonb,
  source text check (source in ('cv', 'upload')),
  language text default 'tr',
  created_at timestamp with time zone default now() not null
);

-- RLS
alter table public.skills_analysis enable row level security;
create policy "Users can manage own skills analysis" on public.skills_analysis for all using (auth.uid() = user_id);

-- -----------------------------------------------
-- 7. roadmap_analysis (AI yol haritası)
-- -----------------------------------------------
create table if not exists public.roadmap_analysis (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  target_position text,
  overall_score integer not null,
  readiness jsonb not null,
  steps jsonb not null,
  insights jsonb not null,
  source text check (source in ('cv', 'upload')),
  language text default 'tr',
  created_at timestamp with time zone default now() not null
);

-- RLS
alter table public.roadmap_analysis enable row level security;
create policy "Users can manage own roadmap analysis" on public.roadmap_analysis for all using (auth.uid() = user_id);
