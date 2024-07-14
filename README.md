[![ReadMeSupportPalestine](https://raw.githubusercontent.com/Safouene1/support-palestine-banner/master/banner-project.svg)](https://github.com/Safouene1/support-palestine-banner/Markdown-pages/Support.md)

# Yukitanya

Yukitanya adalah platform yang menghubungkan banyak siswa ke dalam sebuah forum diskusi untuk menyelesaikan tugas sekolah secara bersama.
Terinspirasi dari Brainly dan Twitter.

## Fitur-fitur

- Membuat pertanyaan berdasarkan mata pelajaran tertentu
- Membuat pertanyaan dengan gambar
- Bagikan link pertanyaan ke sosial media
- Filtering kata-kata terlarang
- CAPTCHA
- Rating jawaban
- Tanyakan kepada AI
- Fitur search pertanyaan dan pengguna
- Fitur notifikasi
- Tampilan responsive
- Pembayaran membership dengan payment gateway
- dan lain-lain

## Tech Stack

- Node.js
- Next.js
- TypeScript
- Drizzle ORM
- PostgreSQL
- Tailwind CSS
- Shadcn UI
- Typesense

## Instalasi

### Requirement

- Node.js (Minimal LTS)
- PostgreSQL
- [Google](https://console.cloud.google.com/apis/dashboard) dan [Facebook](https://developers.facebook.com/apps/) OAuth key
- [Cloudflare Turnstile](https://www.cloudflare.com/products/turnstile/) key
- [Uploadthing](https://uploadthing.com/) API key
- [Midtrans](https://midtrans.com/) key
- [Typesense](https://typesense.org/)

## Langkah-langkah

1. Clone repo

```bash
git clone https://github.com/tfkhdyt/yukitanya
```

1. Instal dependency

```bash
pnpm i # atau npm i
```

1. Buat salinan file `.env.example`

```bash
cp .env.example .env
```

1. Isi konfigurasi `.env` yang diperlukan
1. Lakukan seeding database

```bash
pnpm db:seed # atau npm run db:seed
```

1. Push schema ke database

```bash
pnpm db:push # atau npm run db:push
```

1. Selesai

## Cara Penggunaan

### Development

```bash
pnpm dev
```

### Production

```bash
pnpm build
pnpm start # atau pm2 start ecosystem.config.js jika menggunakan pm2
```
