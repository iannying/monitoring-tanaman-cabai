# CHILI SENSE — Smart Chili Monitoring System

A premium dashboard prototype for a smart chili monitoring system using React, TypeScript, Tailwind CSS, Recharts, and a lightweight Express API.

## Fitur utama

- Dashboard premium dengan sisi sidebar dan kartu metrik
- Decision tree classification untuk suhu, kelembapan, dan intensitas cahaya
- Demo mode dan live mode indicator
- Notifikasi event dan ringkasan analitik
- API backend untuk data sensor dan perangkat IoT
- Threshold konfigurasi yang bisa diubah di halaman pengaturan

## Teknologi

- Frontend: React + TypeScript
- Styling: Tailwind CSS
- Chart: Recharts
- Icons: Lucide React
- Backend: Express.js
- Runtime: Node.js

## Instalasi

1. Buka folder project
2. Jalankan:

```bash
npm install
```

3. Untuk menjalankan aplikasi lengkap:

```bash
npm run dev
```

Aplikasi akan menjalankan:
- Frontend di http://localhost:5173
- API di http://localhost:4000

## Endpoint API

- POST /api/sensor-data
- GET /api/sensor-data/latest
- GET /api/sensor-data/history
- GET /api/device/status
- GET /api/alerts

## Data contoh

Saat aplikasi pertama kali dijalankan, sistem menggunakan data demo dan menampilkan label DEMO. Pengguna dapat menyalakan mode LIVE untuk simulasi integrasi perangkat.

## Catatan

Nilai ambang awal adalah konfigurasi awal prototype dan perlu divalidasi sesuai varietas, fase pertumbuhan, lokasi, serta metode budidaya.
