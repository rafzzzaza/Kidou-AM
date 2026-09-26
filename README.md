<div align="center">

  # ⚡ Kidou AM — Premium Activator

  **Layanan Otomasi & Aktivasi Alight Motion Premium Menggunakan Magic Link**

  [![Server Status](https://img.shields.io/badge/SERVER-ONLINE-00ff87?style=for-the-badge&logo=opsgenie&logoColor=black)](http://localhost:3300)
  [![Version](https://img.shields.io/badge/VERSION-v2.5_PRO-38bdf8?style=for-the-badge)](https://github.com/rafzzzaza)
  [![License](https://img.shields.io/badge/LICENSE-MIT-ff5555?style=for-the-badge)](LICENSE)

  <p align="center">
    <b>Aktivasi Cepat</b> • <b>Aman & Tanpa Password</b> • <b>Desain Modern Cyber-Glassmorphism</b>
  </p>

  <p align="center">
    <a href="#-fitur-utama">Fitur Utama</a> •
    <a href="#-dokumentasi-api">Dokumentasi API</a> •
    <a href="#-panduan-database-jsonbin">Konfigurasi Database</a> •
    <a href="#-cara-instalasi--penggunaan">Panduan Instalasi</a> •
    <a href="#-dukungan--kontribusi">Dukungan</a>
  </p>

  ---

</div>

## 📌 Tentang Proyek

**Kidou AM** (Reverse Engineered AM-Activator) adalah platform web dan backend API yang dirancang untuk memudahkan proses registrasi dan aktivasi layanan **Alight Motion Premium** melalui mekanisme *Magic Link*. 

Sistem ini mendukung alur **Aktivasi Manual Step-by-step** yang terintegrasi dengan email pribadi pengguna, serta opsi **Otomasi Temp-Mail** tanpa memerlukan API key tambahan.

---

## 🚀 Fitur Utama

- 📧 **Mode Manual Step-by-Step**: Alur verifikasi interaktif 3 langkah (*Input Email ➔ Salin Link ➔ Aktivasi Token*).
- 📊 **Real-time Live Stats**: Hitungan otomatis `Total Activations` & `Activated Today` menggunakan integrasi JSONBin.io.
- ⚡ **Satu-Klik Auto Mode**: Pembuatan temporary email otomatis ➔ Pengiriman magic link ➔ Pemeriksaan inbox ➔ Verifikasi & Pengaktifan lisensi.
- 📬 **Integrasi Temp Mail**: Terhubung langsung secara otomatis dengan penyedia email sementara (`tempmail.yandez.my.id`).
- 🔐 **Secure & Anonymous**: Tidak membutuhkan maupun menyimpan kata sandi pengguna secara permanen.
- 🎨 **UI Modern & Responsive**: Menggunakan antarmuka gaya *Cyber Glassmorphism* yang ringan dan nyaman digunakan di ponsel maupun komputer.
- ☁️ **Vercel Ready**: Dilengkapi konfigurasi `vercel.json` dan bebas dari masalah *file-system crash* di Serverless Node.js.

---

## 🗄️ Panduan Database JSONBin

Aplikasi ini menggunakan **JSONBin.io** sebagai database cloud eksternal permanen untuk menyimpan statistik pemakaian secara *real-time* (bebas dari pembatasan serverless Vercel).

### 1. Buat Bin di JSONBin.io
1. Daftar atau masuk ke akun [JSONBin.io](https://jsonbin.io/).
2. Buat **Bin Baru** (*Create Bin*) dan masukkan struktur JSON dasar berikut:
   ```json
   {
     "total_links": 0,
     "totalActivations": 0,
     "daily": {}
   }
   ```
3. Simpan Bin tersebut dan salin **Bin ID** (contoh: `66f5a1b2e4b0e3a6789abcde`).
4. Buka menu **API Keys** di profil akun JSONBin Anda, lalu salin **Master Key** Anda (contoh: `$2a$10$X1yZ...`).

### 2. Atur Environment Variables
Tambahkan variabel berikut pada berkas `.env` lokal Anda atau di **Settings ➔ Environment Variables** pada dashboard Vercel Anda:

| Variable Name | Nilai Contoh | Keterangan |
| :--- | :--- | :--- |
| `JSONBIN_BIN_ID` | `66f5a1b2e4b0e3a...` | ID Bin yang sudah Anda buat di JSONBin |
| `JSONBIN_API_KEY` | `$2a$10$X1yZ...` | Master Key API dari akun JSONBin Anda |

---

## 📡 Dokumentasi API

Seluruh komunikasi backend menggunakan protokol HTTP dengan format respon **JSON**.

### 1. Mode Otomatis Satu Klik (Auto Mode) ⚡
Menjalankan seluruh alur pembuatan temporary email hingga pengaktifan premium secara otomatis.

```http
POST /api/auto
Content-Type: application/json

{}
```

<details>
<summary><b>🔍 Lihat Contoh Respon Success (200 OK)</b></summary>

```json
{
  "success": true,
  "message": "premium aktif untuk rafa-abc123@247chats.com",
  "data": {
    "email": "rafa-abc123@247chats.com",
    "uid": "U12345678",
    "orderId": "rafa-a1b2c3d4e5f6",
    "status": "ACTIVE",
    "idToken": "eyJhbGciOiJSUzI1NiIsImtpZCI6...",
    "validUntil": "13 September 2027"
  },
  "log": [
    { "step": "init", "message": "mengambil domain..." },
    { "step": "email", "message": "email dibuat: rafa-abc123@247chats.com" },
    { "step": "link", "message": "link terkirim, menunggu inbox..." },
    { "step": "poll", "message": "link diterima di inbox" },
    { "step": "verify", "message": "verifikasi berhasil" },
    { "step": "premium", "message": "mengaktifkan premium..." },
    { "step": "done", "message": "premium aktif!" }
  ]
}
```
</details>

---

### 2. Generate Email Sementara
Membuat alamat email sementara secara acak untuk keperluan testing.

```http
GET /api/email/generate
```

---

### 3. Kirim Magic Link (Manual)
Mengirimkan link verifikasi akun ke email yang dispesifikasikan.

```http
POST /api/send-link
Content-Type: application/json

{
  "email": "pengguna@example.com"
}
```

---

### 4. Verifikasi Magic Link
Memverifikasi `magicLink` atau `oobCode` yang didapatkan dari email untuk mengklaim ID Token Premium.

```http
POST /api/verify-link
Content-Type: application/json

{
  "email": "pengguna@example.com",
  "magicLink": "https://alightcreative.page.link/?link=...&oobCode=XYZ123"
}
```

---

### 5. Dapatkan Statistik Aktivasi
Mengambil jumlah total aktivasi (`totalActivations`) dan rincian harian (`daily`) yang tercatat di JSONBin.

```http
GET /api/stats
```

<details>
<summary><b>🔍 Lihat Contoh Respon Success (200 OK)</b></summary>

```json
{
  "total_links": 128,
  "totalActivations": 95,
  "daily": {
    "2026-09-26": 12
  }
}
```
</details>

---

## 🛠️ Cara Instalasi & Penggunaan

### 1. Jalankan di Lokal (Localhost)

Pastikan Anda telah menginstal **Node.js** (versi 16 atau lebih baru) di perangkat Anda.

```bash
# 1. Clone repositori ini
git clone https://github.com/rafzzzaza/AM-PREM-GENERATOR.git

# 2. Masuk ke direktori proyek
cd AM-PREM-GENERATOR

# 3. Instalasi seluruh dependensi
npm install

# 4. Buat file .env dan isi dengan credentials JSONBin
echo "JSONBIN_BIN_ID=your_bin_id" >> .env
echo "JSONBIN_API_KEY=your_master_key" >> .env

# 5. Jalankan server lokal
npm start
# atau
node server.js
```

Buka peramban (browser) Anda dan akses: `http://localhost:3300`

---

### 2. Deploy ke Vercel 🌐

Aplikasi ini sudah dioptimalkan untuk berjalan sempurna di **Vercel**:

1. Push berkas proyek Anda ke **GitHub**.
2. Hubungkan repositori GitHub Anda di dashboard **Vercel**.
3. Buka **Project Settings ➔ Environment Variables** di Vercel, lalu tambahkan:
   - `JSONBIN_BIN_ID`
   - `JSONBIN_API_KEY`
4. Tekan tombol **Deploy**. Aplikasi akan langsung *online* dengan fitur pencatatan statistik real-time!

---

## 💖 Dukungan & Kontribusi

Proyek ini dikembangkan dan dikelola secara independen oleh **Rafa**. Jika Anda menyukai proyek ini, pertimbangkan untuk memberikan dukungan atau berinteraksi melalui media sosial berikut:

| Platform | Username / Tautan |
| :--- | :--- |
| 📸 **Instagram** | [@rafzzzaza](https://instagram.com/rafzzzaza) |
| 🐙 **GitHub** | [@rafzzzaza](https://github.com/rafzzzaza) |
| ☕ **Saweria / Trakter** | [saweria.co/rafaaza](https://saweria.co/rafaaza) |

---

## ⚠️ Penolakan Tanggung Jawab (Disclaimer)

1. Proyek ini dibuat **hanya untuk tujuan edukasi, pembelajaran, dan penelitian** mengenai pembuatan alur otentikasi RESTful API & Magic Link.
2. Pengembang tidak bertanggung jawab atas penyalahgunaan aplikasi ini di luar batasan hukum yang berlaku.
3. Proyek ini sama sekali **tidak berafiliasi** dengan Alight Creative, Inc., Alight Motion, maupun penyedia layanan *temporary mail* manapun.

---

<div align="center">

  **Dibuat dengan ❤️ oleh [Rafa](https://github.com/rafzzzaza)**  
  LISENSI [MIT](LICENSE) © 2026

</div>