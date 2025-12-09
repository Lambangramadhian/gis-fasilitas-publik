# 🗺️ GIS Pencarian Fasilitas Publik

Aplikasi Sistem Informasi Geografis (SIG) berbasis web untuk mencari dan menampilkan berbagai jenis fasilitas publik seperti **Masjid, Klinik, SPBU, ATM, dan Sekolah**. Aplikasi ini menyediakan fitur pencarian, filter kategori, CRUD data fasilitas, serta tampilan peta interaktif menggunakan **Leaflet (OpenStreetMap)**.

Project ini dibuat sebagai pemenuhan **Tugas 5 – Pengembangan Aplikasi GIS**
Program Studi Sistem Informasi – STT Terpadu Nurul Fikri.

---

## 📌 Daftar Isi

* [Deskripsi Proyek](#deskripsi-proyek)
* [Fitur Utama](#fitur-utama)
* [Arsitektur Sistem](#arsitektur-sistem)
* [Teknologi yang Digunakan](#teknologi-yang-digunakan)
* [Instalasi & Menjalankan](#instalasi--menjalankan)
* [Struktur Folder](#struktur-folder)
* [API Endpoint (Backend)](#api-endpoint-backend)
* [Skema Database](#skema-database)
* [Cara Menggunakan Aplikasi](#cara-menggunakan-aplikasi)
* [Pembagian Tugas Kelompok](#pembagian-tugas-kelompok)
* [Rencana Pengembangan](#rencana-pengembangan)
* [Lisensi](#lisensi)

---

## 📌 Deskripsi Proyek

Aplikasi ini dikembangkan untuk membantu pengguna menemukan fasilitas publik dengan cepat dan akurat. Data fasilitas ditampilkan dalam bentuk marker pada peta dan dapat dicari berdasarkan kata kunci atau kategori. Pengguna juga bisa menambahkan fasilitas baru melalui form yang terhubung ke REST API.

Aplikasi memanfaatkan:

* **Leaflet + OpenStreetMap** (Maps API)
* **Express.js REST API**
* **SQLite Database**

---

## ⭐ Fitur Utama

### 🗺️ 1. Peta Interaktif

* Menggunakan Leaflet + OpenStreetMap
* Zoom, drag, dan klik peta untuk mengambil koordinat

### 🔍 2. Pencarian Fasilitas

* Berdasarkan nama, alamat, atau kategori

### 🧭 3. Filter Kategori

Kategori default:

* Masjid
* Klinik
* SPBU
* ATM
* Sekolah

### 📌 4. Marker & Popup Detail

Setiap marker menampilkan:

* Nama
* Kategori
* Alamat
* Informasi tambahan

### ➕ 5. Tambah Lokasi Baru

Form input mencakup:

* Nama
* Kategori
* Alamat
* Latitude / Longitude
* Telepon
* Deskripsi

Klik peta → otomatis mengisi koordinat form.

### 🗃️ 6. REST API CRUD

* GET semua fasilitas
* GET fasilitas berdasarkan ID
* POST menambah fasilitas
* PUT update fasilitas
* DELETE menghapus fasilitas

---

## 🏗️ Arsitektur Sistem

```
┌───────────────────────────────┐
│           Frontend            │
│  HTML + CSS + JS + Leaflet    │
└───────────────┬───────────────┘
                │ REST API
┌───────────────▼───────────────┐
│            Backend            │
│        Node.js + Express      │
└───────────────┬───────────────┘
                │ SQLite Driver
┌───────────────▼───────────────┐
│           SQLite DB           │
└───────────────────────────────┘
```

---

## ⚙️ Teknologi yang Digunakan

### Frontend

* Leaflet.js
* OpenStreetMap Tile Layer
* HTML, CSS, JavaScript

### Backend

* Node.js
* Express.js
* CORS
* Body-parser

### Database

* SQLite3

### Tools Pendukung

* Postman (testing API)
* Git / GitHub

---

## 🚀 Instalasi & Menjalankan

### 1️⃣ Clone Repository

```bash
git clone https://github.com/Lambangramadhian/gis-fasilitas-publik.git
cd gis-fasilitas-publik
```

### 2️⃣ Instal & Menjalankan Backend

```bash
cd backend
npm install
npm run dev
```

Backend berjalan di:

```
http://localhost:3000
```

### 3️⃣ Menjalankan Frontend

Buka langsung:

```
frontend/index.html
```

Atau lewat Express (disarankan, menghindari CORS):

Di `server.js` tambahkan:

```javascript
app.use(express.static('../frontend'));
```

Lalu buka:

```
http://localhost:3000/index.html
```

---

## 📁 Struktur Folder

```
gis-fasilitas-publik/
│
├── backend/
│   ├── server.js
│   ├── facilities.db
│   ├── package.json
│   └── init.sql
│
└── frontend/
    ├── index.html
    ├── main.js
    └── style.css
```

---

## 🔌 API Endpoint (Backend)

### 1. GET semua fasilitas

```
GET /api/facilities
```

Query opsional:

```
?category=Masjid
?q=sehat
```

### 2. GET fasilitas by ID

```
GET /api/facilities/:id
```

### 3. POST tambah fasilitas

```json
{
  "name": "Masjid Agung",
  "category": "Masjid",
  "address": "Jl Merdeka",
  "latitude": -6.2000,
  "longitude": 106.8166,
  "phone": "021-XXXX",
  "description": "Masjid besar pusat kota"
}
```

### 4. PUT update fasilitas

```
PUT /api/facilities/:id
```

### 5. DELETE fasilitas

```
DELETE /api/facilities/:id
```

---

## 🗂️ Skema Database

### Tabel `facilities`

```sql
CREATE TABLE facilities (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  address TEXT,
  latitude REAL NOT NULL,
  longitude REAL NOT NULL,
  phone TEXT,
  description TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

### Sample Data

```sql
INSERT INTO facilities (name, category, address, latitude, longitude) VALUES
('Masjid Agung', 'Masjid', 'Jl. Merdeka 1', -6.2000, 106.8166),
('Klinik Sehat', 'Klinik', 'Jl. Sehat 10', -6.2015, 106.8180),
('SPBU Prima', 'SPBU', 'Jl. Bensin 3', -6.2020, 106.8200);
```

---

## 📝 Cara Menggunakan Aplikasi

1. Buka aplikasi → peta utama tampil.
2. Masukkan kata kunci → klik cari.
3. Gunakan filter kategori.
4. Klik marker untuk melihat detail fasilitas.
5. Tambahkan data baru via form dan klik peta untuk mengisi koordinat otomatis.

---

## 👥 Pembagian Tugas Kelompok

*(Silakan ganti sesuai anggota tim)*

### 1. Ketua / Dokumentasi

* Menyusun laporan & README
* Koordinasi tim
* Dokumentasi perancangan

### 2. Frontend Developer

* Implementasi Leaflet
* Marker, popup
* Form input → API

### 3. Backend Developer

* Express.js
* CRUD API
* SQLite

### 4. Tester & Data Engineer

* Testing UI & API
* Validasi koordinat
* Mengisi data awal

Jika 5 anggota → tambahkan role **DevOps/Deployment**.

---

## 🔮 Rencana Pengembangan

* Routing / navigasi ke fasilitas terdekat
* Integrasi geocoding (alamat → koordinat)
* Upload foto fasilitas
* Login & manajemen admin
* Migrasi database ke PostgreSQL/PostGIS
* Peningkatan responsivitas mobile

---

## 📜 Lisensi

Proyek ini dibuat untuk keperluan edukasi.
Silakan digunakan, dimodifikasi, dan dikembangkan lebih lanjut sesuai kebutuhan.

---

Kalau kamu mau, aku bisa:
✅ Membuat versi README yang lebih ringkas
✅ Membuat versi bahasa Inggris
✅ Membuat badge GitHub
✅ Menambahkan screenshot mockup bagian "Preview Aplikasi"

Mau lanjut?