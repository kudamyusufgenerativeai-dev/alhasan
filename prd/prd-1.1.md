# PRD: Website Masjid v1.1

**Status:** Draft untuk implementasi · **Bahasa:** Indonesia · **Tanggal:** 9 Oktober 2026

## 1. Ringkasan

Website masjid minimalis dengan landing page publik dan dashboard admin. Seluruh konten (identitas masjid, hero, kegiatan, berita, galeri, pengurus) dikelola admin tanpa menyentuh kode. Dibangun dengan Next.js dan Supabase, mobile-first, dominan putih dengan aksen hijau.

## 2. Tujuan dan Non-Tujuan

**Tujuan**
- Memberi jamaah informasi masjid yang rapi dan cepat dibuka di smartphone.
- Memungkinkan pengurus memperbarui konten sendiri lewat dashboard.
- Mengarahkan donasi ke Google Form.
- Struktur kode siap menambah jadwal salat dan laporan keuangan dinamis (v2.0).

**Non-Tujuan v1.0**
- Jadwal salat, countdown salat, tanggal Hijriah.
- Laporan keuangan dinamis (hanya section statis).
- Signup/registrasi pengguna, komentar, pendaftaran peserta event.
- Payment gateway, multi-bahasa, album galeri, role admin berbeda.

## 3. Pengguna

| Peran | Kebutuhan |
|---|---|
| **Jamaah / pengunjung** | Melihat info masjid, kegiatan, berita, galeri, pengurus, kontak, dan lokasi; menekan tombol donasi. |
| **Admin** | Login, mengubah pengaturan masjid dan hero, mengelola event, berita, galeri, dan pengurus. |

## 4. Tech Stack dan Ketentuan Desain

| Area | Keputusan |
|---|---|
| Frontend | Next.js (App Router), TypeScript |
| Backend | Supabase: Auth, Postgres, Storage |
| UI | Shadcn UI + Tailwind CSS (mobile-first, breakpoint `sm` → `md` → `lg`) |
| Icons | React Icons |
| Font | Geist (satu font untuk heading dan body, hierarki lewat ukuran dan weight) |
| Warna | Putih dominan, hijau sebagai aksen (CTA, ikon, highlight, link aktif) |
| Gaya | Minimalis, whitespace lega, kartu sederhana, sudut membulat, bayangan tipis |
| Data | Server Components + `@supabase/ssr`; mutasi lewat Server Actions; `revalidatePath` setelah simpan |
| Form | react-hook-form + zod |
| Markdown | `react-markdown` untuk isi berita |

**Panduan warna (CSS variables Shadcn):** `--background` putih; `--primary` hijau (disarankan sekitar `#15803d` / `green-700`); `--accent` hijau sangat muda (`green-50`) untuk latar section selang-seling; teks utama abu gelap, bukan hitam pekat.

**Prinsip mobile-first:** semua kelas ditulis untuk layar kecil dulu, lalu ditambah prefix `md:`/`lg:`. Navbar menjadi hamburger (Shadcn `Sheet`) di mobile. Target tap minimal 44px. Tabel admin berubah menjadi daftar kartu di mobile.

## 5. Struktur Rute

| Rute | Deskripsi |
|---|---|
| `/` | Landing page (ringkasan semua section) |
| `/berita` | Daftar semua berita (paginasi) |
| `/berita/[slug]` | Detail berita |
| `/galeri` | Semua foto (grid + lightbox) |
| `/login` | Login admin |
| `/admin` | Ringkasan dashboard |
| `/admin/pengaturan` | Pengaturan masjid |
| `/admin/event` | Daftar + tambah/ubah/hapus event |
| `/admin/berita` | Daftar + tambah/ubah/hapus berita |
| `/admin/galeri` | Upload dan kelola foto |
| `/admin/pengurus` | Kelola pengurus dan ustaz |

Tidak ada rute signup, lupa password publik, atau daftar pengguna.

## 6. Kebutuhan Fungsional: Halaman Publik

**Navbar.** Logo + nama masjid, menu anchor (Tentang, Kegiatan, Berita, Galeri, Laporan, Pengurus, Kontak), tombol **Donasi** hijau (buka `donation_url` di tab baru). Sticky, hamburger di mobile.

**Hero.** Gambar background dari admin dengan overlay putih/gelap tipis agar teks terbaca, nama masjid, tagline, deskripsi singkat, tombol "Donasi" dan "Tentang Kami". Jika gambar belum diatur, tampilkan latar hijau muda polos. Gambar memakai `next/image` dengan `priority`.

**Tentang.** Deskripsi masjid, alamat, dan kartu statistik singkat. Kartu statistik (contoh: tahun berdiri, jumlah jamaah, jumlah program) bersifat **statis** — nilainya didefinisikan di `lib/data/about.ts` dan tidak bisa diubah lewat dashboard admin.

**Kegiatan.** Maksimal 3 event mendatang sebagai kartu (gambar, judul, tanggal & jam, lokasi). Event yang sudah lewat (`starts_at` < waktu sekarang) **otomatis disembunyikan** dari section ini — tidak perlu aksi admin. Klik kartu membuka dialog detail. Jika kosong: "Belum ada kegiatan mendatang."

**Berita.** 3 berita terbaru (sampul, judul, kutipan, tanggal) + tautan "Lihat semua" ke `/berita`. Halaman detail merender markdown, ada tombol bagikan WhatsApp.

**Galeri.** **8 foto** terbaru dalam grid `2×4` (`grid-cols-2 md:grid-cols-4`); "Lihat semua" ke `/galeri`. Lightbox dengan caption.

**Laporan keuangan (statis).** Judul, teks "Laporan keuangan akan segera tersedia", tiga kartu ringkas (Pemasukan, Pengeluaran, Saldo) berisi tanda "–". Data dipasok lewat fungsi `getFinancialSummary()` yang di v1.0 mengembalikan data statis, sehingga v2.0 cukup mengganti isinya ke Google Sheets tanpa mengubah komponen UI.

**Pengurus & Ustaz.** Kartu foto, nama, jabatan; urut sesuai `sort_order`.

**Donasi.** Section ajakan singkat dengan tombol ke `donation_url`. Jika URL kosong, tombol disembunyikan.

**Footer.** Logo, alamat, telepon/WhatsApp, email, embed Google Maps, ikon sosmed (hanya yang terisi), hak cipta.

## 7. Kebutuhan Fungsional: Dashboard Admin

**Autentikasi**
- Login email + password via Supabase Auth. Tidak ada signup di website.
- Middleware melindungi semua rute `/admin/*`; pengguna tanpa sesi diarahkan ke `/login`. Pengguna yang sudah login membuka `/login` diarahkan ke `/admin`.
- Tombol keluar (logout) di header dashboard.
- Semua user terdaftar di Supabase Auth dianggap admin.

**Pengaturan masjid** (satu form, satu baris data)
- Nama masjid, tagline, deskripsi
- Alamat lengkap, telepon, WhatsApp, email
- URL `src` iframe Google Maps (hanya URL-nya, bukan kode `<iframe>` lengkap; sistem yang merender `<iframe>` di frontend)
- Logo (upload)
- **Background hero (upload, dengan pratinjau, bisa dihapus/diganti)**, judul dan subjudul hero
- Link sosmed: Instagram, Facebook, YouTube, TikTok
- **Link donasi (URL Google Form)**

**CRUD** (daftar, tambah, ubah, hapus dengan dialog konfirmasi)

| Modul | Field |
|---|---|
| Event | Judul, tanggal & jam mulai, jam selesai (opsional), lokasi, deskripsi, gambar, status terbit |
| Berita | Judul, slug (di-generate otomatis dari judul **saat pertama kali disimpan/submit**, tidak berubah bila judul diedit, dapat diedit manual oleh admin), kutipan, gambar sampul, isi (markdown dengan pratinjau), status terbit |
| Galeri | Foto (bisa upload beberapa sekaligus), caption, urutan |
| Pengurus | Nama, jabatan, foto, bio singkat (opsional), urutan |

**Ketentuan umum dashboard:** validasi form dengan pesan error Bahasa Indonesia, toast sukses/gagal (Shadcn `Sonner`), indikator loading di tombol simpan, layout sidebar di desktop dan menu bawah/drawer di mobile.

## 8. Skema Database Supabase

```sql
-- Pengaturan masjid (satu baris)
create table mosque_settings (
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
insert into mosque_settings (id) values (1);

create table events (
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

create table news (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text unique not null,
  excerpt text,
  cover_url text,
  content text not null,            -- markdown
  is_published boolean default true,
  published_at timestamptz default now(),
  created_at timestamptz default now()
);

create table gallery_photos (
  id uuid primary key default gen_random_uuid(),
  image_url text not null,
  caption text,
  sort_order int default 0,
  created_at timestamptz default now()
);

create table board_members (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  role text not null,
  photo_url text,
  bio text,
  sort_order int default 0,
  created_at timestamptz default now()
);
```

**Row Level Security (wajib aktif di semua tabel)**
- `select`: publik (anon) boleh membaca `mosque_settings`, `gallery_photos`, `board_members`; untuk `events` dan `news` hanya baris `is_published = true`.
- `insert/update/delete`: hanya role `authenticated`.
- `mosque_settings`: tidak ada `insert`/`delete` dari klien, hanya `update`.

**Storage.** Satu bucket publik `mosque-media` dengan folder `hero/`, `logo/`, `events/`, `news/`, `gallery/`, `board/`. Baca publik, tulis/hapus hanya `authenticated`. Batas 5 MB per file, hanya JPG/PNG/WebP. File lama dihapus dari storage saat gambar diganti atau data dihapus.

## 9. Kebutuhan Non-Fungsional

- **Responsif:** nyaman dari lebar 360px; tidak ada scroll horizontal.
- **Performa:** target Lighthouse mobile ≥ 90 (Performance, Accessibility, SEO); gambar via `next/image` dengan `remotePatterns` ke domain Supabase; halaman publik memakai caching/ISR dan di-revalidate saat admin menyimpan.
- **SEO:** metadata dinamis (judul, deskripsi, Open Graph) dari pengaturan masjid dan berita; `sitemap.xml` dan `robots.txt`; `robots` noindex untuk `/admin` dan `/login`.
- **Keamanan:** Disable signups di Supabase; akun admin dibuat manual lewat dashboard Supabase; RLS aktif; `service_role` key tidak pernah dipakai di klien; sanitasi markdown (tanpa HTML mentah); link eksternal memakai `rel="noopener noreferrer"`.
- **Aksesibilitas:** kontras teks memenuhi WCAG AA, `alt` pada semua gambar, navigasi keyboard, label form jelas.
- **Environment variables:** `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `NEXT_PUBLIC_SITE_URL`.

## 10. Struktur Proyek (usulan)

```
src/
  app/
    (public)/page.tsx, berita/, galeri/
    login/page.tsx
    admin/ (layout, pengaturan, event, berita, galeri, pengurus)
  components/
    ui/            # shadcn
    sections/      # hero, about, events, news, gallery, finance, board, donation, footer
    admin/         # form, tabel, uploader
  lib/
    supabase/ (client.ts, server.ts, middleware.ts)
    data/ (settings.ts, events.ts, news.ts, gallery.ts, board.ts, finance.ts)
    actions/       # server actions
  middleware.ts
```

Komponen `sections/` hanya menerima props; pengambilan data ada di `lib/data/`. Ini yang membuat v2.0 (jadwal salat, laporan dari spreadsheet) mudah ditambahkan.

## 11. Acceptance Criteria

1. Landing page tampil benar di 360px, 768px, dan 1280px tanpa scroll horizontal.
2. Seluruh teks (heading dan body) memakai Geist; ikon memakai React Icons.
3. Tampilan dominan putih dengan aksen hijau konsisten.
4. Tidak ada tombol/halaman signup; hanya `/login`.
5. Mengakses `/admin/*` tanpa login mengarah ke `/login`.
6. Admin dapat mengubah nama, alamat, kontak, dan sosmed; perubahan muncul di landing page dan footer tanpa deploy ulang.
7. Admin dapat mengunggah dan mengganti background hero; hero publik langsung berubah, gambar lama terhapus dari storage.
8. Tombol Donasi (navbar dan section) membuka link Google Form dari dashboard; tersembunyi bila link kosong.
9. Admin dapat tambah/ubah/hapus event, berita, foto galeri, dan pengurus; draft (belum terbit) tidak tampil di publik.
10. `/berita`, `/berita/[slug]`, dan `/galeri` berfungsi, lengkap dengan metadata SEO.
11. Section laporan keuangan tampil statis dan terpisah dari sumber datanya (`getFinancialSummary()`).
12. Setiap section menampilkan empty state yang rapi saat data kosong.
13. Upload ditolak bila bukan JPG/PNG/WebP atau lebih dari 5 MB, dengan pesan jelas.
14. Pengguna anon tidak dapat menulis ke tabel atau storage (diuji lewat RLS).

## 12. Fase Pengerjaan

1. **Fondasi:** setup Next.js, Shadcn, Geist, tema hijau-putih; proyek Supabase (tabel, RLS, bucket); auth + middleware.
2. **Dashboard:** pengaturan masjid (termasuk hero dan donasi), lalu CRUD pengurus, event, berita, galeri.
3. **Halaman publik:** landing page semua section, `/berita`, `/galeri`.
4. **Penyelesaian:** SEO, empty state, uji responsif, uji RLS, optimasi performa, deploy (disarankan Vercel).

## 13. Roadmap v2.0 (di luar cakupan)

- Jadwal salat (API otomatis + iqamah manual), highlight salat berikutnya, tanggal Hijriah.
- Laporan keuangan dari Google Sheets (ganti isi `getFinancialSummary()`, tambah tabel/riwayat per periode).
- Opsional: album galeri, rich text editor, whitelist tabel `admins`.

## 14. Asumsi

- Satu masjid per instalasi.
- Admin dibuat manual di Supabase dan mengelola password-nya lewat dashboard Supabase.
- Konten bersifat teks Indonesia; zona waktu tampilan `Asia/Jakarta` (WIB), dapat disesuaikan.
- Peta memakai embed Google Maps yang URL-nya ditempel admin.