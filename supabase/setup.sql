-- ============================================================
-- Masjid Website v1.1 – Supabase SQL Setup
-- Jalankan di: Supabase Dashboard > SQL Editor
-- ============================================================

-- ─── Tables ──────────────────────────────────────────────────

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
-- Seed the single row if not exists
insert into mosque_settings (id) values (1) on conflict do nothing;

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

-- ─── Row Level Security ────────────────────────────────────────

alter table mosque_settings  enable row level security;
alter table events           enable row level security;
alter table news             enable row level security;
alter table gallery_photos   enable row level security;
alter table board_members    enable row level security;

-- mosque_settings: public read, no insert/delete from client, only update by authenticated
create policy "public can read mosque_settings"
  on mosque_settings for select to anon using (true);
create policy "authenticated can update mosque_settings"
  on mosque_settings for update to authenticated using (true);

-- events: public read (published only), full CRUD for authenticated
create policy "public can read published events"
  on events for select to anon using (is_published = true);
create policy "authenticated full access events"
  on events for all to authenticated using (true);

-- news: public read (published only), full CRUD for authenticated
create policy "public can read published news"
  on news for select to anon using (is_published = true);
create policy "authenticated full access news"
  on news for all to authenticated using (true);

-- gallery_photos: public read, full CRUD for authenticated
create policy "public can read gallery_photos"
  on gallery_photos for select to anon using (true);
create policy "authenticated full access gallery_photos"
  on gallery_photos for all to authenticated using (true);

-- board_members: public read, full CRUD for authenticated
create policy "public can read board_members"
  on board_members for select to anon using (true);
create policy "authenticated full access board_members"
  on board_members for all to authenticated using (true);

-- ─── Storage ──────────────────────────────────────────────────
-- Buat bucket "mosque-media" di Supabase Dashboard > Storage:
-- 1. Klik "New bucket" > nama: mosque-media > Public: ON
-- 2. Tambahkan policy storage berikut:

-- Storage SELECT (public read):
-- create policy "public read mosque-media"
--   on storage.objects for select to anon
--   using ( bucket_id = 'mosque-media' );

-- Storage INSERT/UPDATE/DELETE (authenticated only):
-- create policy "authenticated write mosque-media"
--   on storage.objects for insert to authenticated
--   with check ( bucket_id = 'mosque-media' );
-- create policy "authenticated delete mosque-media"
--   on storage.objects for delete to authenticated
--   using ( bucket_id = 'mosque-media' );
