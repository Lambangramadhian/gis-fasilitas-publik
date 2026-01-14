# 🗺️ GIS Pencarian Fasilitas Publik

**Pengembangan Aplikasi Sistem Informasi Geografis Berbasis Web**

Proyek ini merupakan aplikasi **Web-based GIS** yang dikembangkan untuk memenuhi **Tugas 5 Mata Kuliah Sistem Informasi Geografis**, Program Studi Sistem Informasi, STT Terpadu Nurul Fikri.

Aplikasi memanfaatkan **Maps API (Leaflet)** untuk menampilkan peta interaktif serta menyediakan fitur pencarian dan pengelolaan data fasilitas publik.

---

## 📌 Deskripsi Aplikasi

Aplikasi GIS Pencarian Fasilitas Publik bertujuan untuk membantu pengguna menemukan lokasi fasilitas publik secara cepat dan visual melalui peta digital. Fasilitas yang ditampilkan meliputi masjid, klinik, SPBU, ATM, dan sekolah.

Permasalahan yang diselesaikan oleh aplikasi ini adalah keterbatasan informasi lokasi fasilitas publik yang mudah diakses dan terintegrasi dalam satu sistem berbasis peta.

---

## 🎯 Tujuan Pengembangan

* Menerapkan penggunaan **Maps API** sesuai materi perkuliahan
* Mengembangkan aplikasi **Web GIS** berbasis client-server
* Menyediakan fitur pencarian dan visualisasi data spasial
* Menerapkan konsep input dan output pada aplikasi SIG
* Mengintegrasikan data spasial dengan basis data

---

## ⭐ Fitur Aplikasi

### 1. Menampilkan Peta Digital

* Menggunakan **Leaflet Maps API**
* Tile layer dari **OpenStreetMap**
* Peta dapat di-zoom dan di-drag

### 2. Penambahan Marker Lokasi

* Marker menunjukkan lokasi fasilitas publik
* Setiap marker memiliki popup informasi

### 3. Pencarian dan Filter Data

* Pencarian berdasarkan nama atau alamat
* Filter berdasarkan kategori fasilitas

### 4. Event Handling pada Peta

* Klik peta untuk mendapatkan koordinat lokasi
* Koordinat otomatis terisi ke form input

### 5. Input Data Fasilitas Publik

* Form input lokasi baru
* Data disimpan ke basis data SQLite

### 6. Backend CRUD API

* Create, Read, Update, Delete data fasilitas
* REST API berbasis Express.js

---

## 🏗️ Arsitektur Sistem

Aplikasi ini menerapkan konsep **Distributed GIS (Web-based GIS)**.

```
Client (Web Browser)
        ↓
Frontend (HTML, CSS, JavaScript, Leaflet)
        ↓ REST API
Backend (Node.js + Express)
        ↓
Database (SQLite)
```

Komponen sistem sesuai konsep SIG terdistribusi:

* Client
* Web/Application Server
* Data Server

---

## ⚙️ Teknologi yang Digunakan

### Maps API

* **Leaflet.js**
* OpenStreetMap Tile Server

### Frontend

* HTML
* CSS
* JavaScript

### Backend

* Node.js
* Express.js

### Database

* SQLite

---

## 📁 Struktur Folder

```
gis-fasilitas-publik/
│
├── backend/
│   ├── server.js
│   ├── package.json
│   ├── facilities.db
│
└── frontend/
    └── index.html
```

---

## 🔌 Endpoint API

### GET Semua Fasilitas

```
GET /api/facilities
```

### GET Berdasarkan ID

```
GET /api/facilities/{id}
```

### Tambah Data Fasilitas

```
POST /api/facilities
```

### Update Data

```
PUT /api/facilities/{id}
```

### Hapus Data

```
DELETE /api/facilities/{id}
```

---

## 🗂️ Skema Basis Data

**Tabel facilities**

```sql
CREATE TABLE facilities (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT,
  category TEXT,
  address TEXT,
  latitude REAL,
  longitude REAL,
  phone TEXT,
  description TEXT
);
```

---

## 📝 Cara Menggunakan Aplikasi

1. Jalankan backend server
2. Buka aplikasi melalui browser
3. Peta akan ditampilkan secara otomatis
4. Gunakan fitur pencarian atau filter kategori
5. Klik marker untuk melihat detail fasilitas
6. Klik peta untuk menambahkan lokasi baru

---

## 👥 Pembagian Tugas Kelompok

Contoh pembagian tugas anggota:

* **Indah Agustin**

  * Koordinasi dan dokumentasi
  * Penyusunan laporan

* **Fatih Mubasyir**

  * Implementasi Leaflet Maps API
  * Tampilan peta dan marker
  * Pembuatan REST API
  * Integrasi database

* **Lambang Ramadhian**

  * Pengujian aplikasi
  * Input dan validasi data spasial

---

## 🎥 Video Presentasi

* Durasi maksimal: 10 menit
* Setiap anggota tampil dan menyebutkan nama serta NIM
* Menjelaskan:

  * Tools dan teknologi
  * Cara kerja aplikasi
  * Demo fitur

---

## 📅 Deadline

* **Laporan Tugas**: 18 Januari 2026
* **Unggah Video Presentasi**: 18 Januari 2026

---

## 🔮 Pengembangan Selanjutnya

* Perhitungan jarak fasilitas terdekat
* Integrasi geocoding alamat
* Autentikasi pengguna
* Migrasi database ke PostGIS

---

## 📜 Lisensi

Proyek ini dibuat untuk kepentingan akademik dan pembelajaran.
