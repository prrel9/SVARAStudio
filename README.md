# SVARA STUDIO

Platform booking studio musik modern untuk menampilkan ruang studio, mengecek jadwal, menerima booking, dan mengelola operasional dari dashboard admin.

## Fitur utama

- Katalog studio, detail ruang, harga, kapasitas, dan peralatan.
- Jadwal booking serta validasi slot agar tidak terjadi bentrok.
- Alur booking pelanggan: data pemesan, konfirmasi, dan unggah bukti pembayaran.
- Dashboard admin untuk mengelola studio, peralatan, booking, pembayaran, serta pengaturan bisnis.
- Upload thumbnail studio dan logo ke Supabase Storage.
- Statistik booking, pendapatan, status pembayaran, dan aktivitas terkini.
- Autentikasi admin berbasis Supabase Auth dan proteksi rute `/admin`.
- Pembaruan realtime untuk data studio/thumbnail melalui Supabase Realtime.

## Teknologi

| Area | Teknologi |
| --- | --- |
| Frontend | Next.js 15, React 19, TypeScript |
| Styling | Tailwind CSS 4 |
| Backend & database | Supabase (PostgreSQL, Auth, Storage, Realtime) |
| Visualisasi | Recharts, GSAP, Framer Motion, React Three Fiber |
| Deployment | Vercel |

## Menjalankan proyek secara lokal

### Prasyarat

- Node.js 20 atau lebih baru
- npm 10 atau lebih baru
- Project Supabase

### Instalasi

```bash
git clone https://github.com/prrel9/SVARAStudio.git
cd SVARAStudio
npm install
```

Buat file `.env.local` pada root proyek:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
CRON_SECRET=your-random-secret
```

> Jangan pernah memasukkan `SUPABASE_SERVICE_ROLE_KEY` ke client, commit Git, atau layanan publik. Key ini hanya digunakan pada route/server service.

Jalankan development server:

```bash
npm run dev
```

## Konfigurasi Supabase

Jalankan file SQL dalam folder `supabase/migrations` melalui **Supabase Dashboard → SQL Editor**, sesuai urutan nomor file.

Untuk pembaruan thumbnail studio antar-tab secara realtime, jalankan juga:

```text
supabase/migrations/006_enable_studios_realtime.sql
```

Migration `006` di repository bersifat idempoten, jadi aman dijalankan sekali melalui file aslinya. Pastikan pengguna admin memiliki policy `SELECT` pada tabel `studios`, karena Supabase Realtime mengikuti Row Level Security (RLS).

## Perintah yang tersedia

```bash
# Menjalankan aplikasi saat development
npm run dev

# Membuat production build
npm run build

# Menjalankan build production secara lokal
npm run start

# Menjalankan pengecekan ESLint
npm run lint
```

## Halaman penting

| Rute | Keterangan |
| --- | --- |
| `/` | Landing page, studio unggulan, dan testimoni |
| `/studios` | Daftar seluruh studio |
| `/studios/[slug]` | Detail studio |
| `/schedule` | Jadwal dan ketersediaan studio |
| `/booking` | Proses booking pelanggan |
| `/admin/login` | Login administrator |
| `/admin` | Analitik dan ringkasan operasional |
| `/admin/studios` | Manajemen studio dan thumbnail |
| `/admin/equipments` | Manajemen peralatan |
| `/admin/bookings` | Manajemen booking |
| `/admin/payments` | Verifikasi pembayaran |
| `/admin/settings` | Pengaturan informasi bisnis |

## Deploy ke Vercel

1. Push branch `main` ke GitHub.
2. Import repository di [Vercel](https://vercel.com/new).
3. Masukkan seluruh environment variable dari `.env.local` pada **Project Settings → Environment Variables**.
4. Deploy.

Setelah mengganti environment variable atau migration Supabase, lakukan redeploy agar server route menggunakan konfigurasi terbaru.

## Struktur proyek

```text
app/                    # Halaman, API routes, dan dashboard admin
components/             # Komponen UI, layout, dan section halaman
lib/services/           # Akses data dan business logic Supabase
lib/supabase/           # Browser, server, admin client, dan middleware
supabase/migrations/    # Migration database Supabase
public/                 # Aset statis
docs/                   # Dokumentasi produk dan desain
```

## Lisensi

Private project — seluruh hak cipta dilindungi.
