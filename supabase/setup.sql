-- ============================================================
-- Masjid Website v1.1 – Supabase SQL Setup
-- Jalankan di: Supabase Dashboard > SQL Editor > Run
-- ============================================================

-- ─── 1. Tables ──────────────────────────────────────────────────

create table if not exists mosque_settings (
  id int primary key default 1 check (id = 1),
  name text not null default 'Masjid',
  tagline text,
  description text,
  address text,
  phone text,
  whatsapp text,
  email text,
  maps_embed_url text,
  logo_url text,
  hero_image_url text,
  hero_title text,
  hero_subtitle text,
  donation_url text,
  instagram_url text,
  facebook_url text,
  youtube_url text,
  tiktok_url text,
  updated_at timestamptz default now()
);

-- Seed row default (id = 1) agar query update/select selalu menemukan row
insert into mosque_settings (id) values (1) on conflict (id) do nothing;

create table if not exists events (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  starts_at timestamptz not null,
  ends_at timestamptz,
  location text,
  description text,
  image_url text,
  is_published boolean default true,
  created_at timestamptz default now()
);

create table if not exists news (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text unique not null,
  excerpt text,
  cover_url text,
  content text not null,
  is_published boolean default true,
  published_at timestamptz default now(),
  created_at timestamptz default now()
);

create table if not exists gallery_photos (
  id uuid primary key default gen_random_uuid(),
  image_url text not null,
  caption text,
  sort_order int default 0,
  created_at timestamptz default now()
);

create table if not exists board_members (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  role text not null,
  photo_url text,
  bio text,
  sort_order int default 0,
  created_at timestamptz default now()
);

-- ─── 2. Enable Row Level Security (RLS) ────────────────────────

alter table mosque_settings  enable row level security;
alter table events           enable row level security;
alter table news             enable row level security;
alter table gallery_photos   enable row level security;
alter table board_members    enable row level security;

-- ─── 3. RLS Policies ──────────────────────────────────────────

-- mosque_settings: publik bisa membaca, user login (authenticated) bisa ubah & tambah
drop policy if exists "public can read mosque_settings" on mosque_settings;
drop policy if exists "authenticated can update mosque_settings" on mosque_settings;
drop policy if exists "authenticated full access mosque_settings" on mosque_settings;

create policy "public can read mosque_settings"
  on mosque_settings for select
  using (true);

create policy "authenticated full access mosque_settings"
  on mosque_settings for all
  to authenticated
  using (true)
  with check (true);

-- events: publik bisa membaca event yang dipublish, authenticated full akses
drop policy if exists "public can read published events" on events;
drop policy if exists "authenticated full access events" on events;

create policy "public can read published events"
  on events for select
  using (is_published = true);

create policy "authenticated full access events"
  on events for all
  to authenticated
  using (true)
  with check (true);

-- news: publik bisa membaca berita yang dipublish, authenticated full akses
drop policy if exists "public can read published news" on news;
drop policy if exists "authenticated full access news" on news;

create policy "public can read published news"
  on news for select
  using (is_published = true);

create policy "authenticated full access news"
  on news for all
  to authenticated
  using (true)
  with check (true);

-- gallery_photos: publik bisa membaca, authenticated full akses
drop policy if exists "public can read gallery_photos" on gallery_photos;
drop policy if exists "authenticated full access gallery_photos" on gallery_photos;

create policy "public can read gallery_photos"
  on gallery_photos for select
  using (true);

create policy "authenticated full access gallery_photos"
  on gallery_photos for all
  to authenticated
  using (true)
  with check (true);

-- board_members: publik bisa membaca, authenticated full akses
drop policy if exists "public can read board_members" on board_members;
drop policy if exists "authenticated full access board_members" on board_members;

create policy "public can read board_members"
  on board_members for select
  using (true);

create policy "authenticated full access board_members"
  on board_members for all
  to authenticated
  using (true)
  with check (true);

-- ─── 4. Storage Bucket Setup ──────────────────────────────────
-- Buat bucket di: Supabase Dashboard > Storage > Create bucket
-- Nama: mosque-media
-- Public bucket: ON (Centang)
--
-- Jalankan policy storage berikut setelah bucket dibuat:
--
-- insert into storage.buckets (id, name, public)
-- values ('mosque-media', 'mosque-media', true)
-- on conflict (id) do nothing;
--
-- create policy "public read mosque-media"
--   on storage.objects for select
--   using ( bucket_id = 'mosque-media' );
--
-- create policy "authenticated insert mosque-media"
--   on storage.objects for insert
--   to authenticated
--   with check ( bucket_id = 'mosque-media' );
--
-- create policy "authenticated update mosque-media"
--   on storage.objects for update
--   to authenticated
--   using ( bucket_id = 'mosque-media' );
--
-- create policy "authenticated delete mosque-media"
--   on storage.objects for delete
--   to authenticated
--   using ( bucket_id = 'mosque-media' );
