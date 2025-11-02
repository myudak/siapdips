# Justifikasi Izin (Permission Justifications) - Bahasa Indonesia

## Untuk Pengisian Form Chrome Web Store - Tab Praktik Privasi

---

## ✅ IZIN YANG DIGUNAKAN (Permissions In Use)

### 1. **alarms**

**Justifikasi:**

Ekstensi ini memerlukan izin `alarms` untuk menjalankan fitur penghemat memori otomatis. Izin ini digunakan untuk membuat alarm berkala (setiap 1 menit) yang memeriksa tab-tab browser mana saja yang sudah tidak aktif dalam waktu lama.

**Penggunaan spesifik:**
- Memeriksa tab yang tidak digunakan secara berkala dan menangguhkan (suspend) tab tersebut untuk menghemat RAM
- Menutup otomatis tab yang sudah ditangguhkan terlalu lama sesuai pengaturan pengguna
- Memastikan pengecekan berjalan secara efisien tanpa menguras baterai

**Mengapa diperlukan:**
Tanpa izin `alarms`, ekstensi tidak dapat menjalankan pengecekan berkala di latar belakang. Fitur tab suspender membantu mahasiswa yang sering membuka banyak tab untuk kuliah online, jurnal, dan portal kampus agar browser tidak boros memori.

**Data yang diakses:**
Tidak ada data pribadi yang dikumpulkan. Alarm hanya digunakan untuk trigger pengecekan status tab (aktif/tidak aktif).

---

### 2. **contextMenus**

**Justifikasi:**

Ekstensi ini memerlukan izin `contextMenus` untuk menambahkan menu pintasan pada menu klik-kanan browser. Ini memberikan akses cepat bagi pengguna untuk mengelola tab mereka.

**Penggunaan spesifik:**
- Menu "💤 Suspend this tab" - Menunda tab saat ini secara manual
- Menu "😶‍🌫️ Close all suspended tabs" - Menutup semua tab yang sudah ditangguhkan sekaligus

**Mengapa diperlukan:**
Memberikan kemudahan akses kepada pengguna tanpa harus membuka popup atau settings ekstensi. Pengguna dapat langsung menangguhkan tab yang sedang tidak dipakai dengan klik kanan.

**Data yang diakses:**
Tidak ada data pribadi yang dikumpulkan. Menu konteks hanya mengirim perintah untuk menunda atau menutup tab.

---

### 3. **tabs**

**Justifikasi:**

Ekstensi ini memerlukan izin `tabs` untuk menyediakan berbagai fitur inti yang membantu produktivitas mahasiswa:

**Penggunaan spesifik:**

1. **Sistem Tab Suspender (Penghemat Memori)**
   - Memeriksa tab mana yang sudah tidak aktif
   - Mengalihkan tab tidak aktif ke halaman suspended untuk menghemat RAM
   - Memulihkan tab ke URL asli ketika pengguna mengkliknya kembali
   - Melindungi data: Memeriksa apakah ada form yang belum disimpan sebelum menangguhkan tab

2. **Injeksi Konten untuk Portal Kampus**
   - Menyuntikkan CSS dark mode ke portal SIAP Undip
   - Menambahkan tema kustom untuk personalisasi tampilan
   - Menyuntikkan script untuk parsing jadwal kuliah
   - Menambahkan tombol dan fitur tambahan di portal kampus

3. **Otomasi Formulir**
   - Auto-fill form evaluasi dosen (PBM) di SIAP Undip
   - Auto-fill form pendaftaran food truck kampus
   - Mempercepat pengisian form berulang yang sering diisi mahasiswa

4. **Fitur Privasi**
   - Blur otomatis untuk informasi sensitif (nama, NIM, nilai)
   - Melindungi privasi saat sharing screen atau presentasi

5. **Navigasi Ekstensi**
   - Membuka halaman settings, job tracker, dan fitur lain dari ekstensi
   - Mengelola tab yang dibuka oleh ekstensi

**Mengapa diperlukan:**
Izin `tabs` adalah izin inti yang memungkinkan semua fitur utama ekstensi bekerja. Tanpa izin ini, ekstensi tidak dapat:
- Menghemat memori dengan tab suspender
- Menambahkan dark mode dan tema ke portal kampus
- Otomatis mengisi form yang repetitif
- Melindungi data pengguna dari kehilangan saat tab ditangguhkan

**Data yang diakses:**
- URL tab (untuk menentukan apakah tab adalah portal kampus)
- Status tab (aktif/tidak aktif, pinned, audio playing)
- Konten halaman **HANYA** pada domain kampus yang diizinkan (siap.undip.ac.id, learn-social.undip.ac.id, dll)

**Data yang TIDAK dikumpulkan atau dikirim:**
- Tidak ada data browsing yang dikirim ke server eksternal
- Tidak ada tracking history penjelajahan
- Semua data disimpan secara lokal di perangkat pengguna
- Tidak ada analitik atau telemetri

---

## ⚠️ IZIN YANG TIDAK DIGUNAKAN (Unused Permissions - HARUS DIHAPUS)

### 4. **webRequest** ❌

**Status:** TIDAK DIGUNAKAN

**Analisis:**
Setelah memeriksa seluruh kode sumber ekstensi, izin `webRequest` tidak ditemukan digunakan di mana pun dalam implementasi. Izin ini mungkin ditambahkan untuk fitur yang direncanakan tapi tidak jadi diimplementasikan.

**Rekomendasi:** **HAPUS dari manifest**

**Alasan:**
- Izin ini tidak diperlukan untuk fungsi ekstensi saat ini
- Meminta izin yang tidak digunakan melanggar prinsip "least privilege"
- Dapat memicu warning keamanan yang menakutkan pengguna
- Dapat memperlambat proses review Chrome Web Store

**Action required:**
```json
// Hapus dari manifest-chrome.json
"permissions": [
  "alarms",
  "contextMenus",
  "tabs",
  "storage"
  // HAPUS INI:
  // "webRequest"
]
```

---

### 5. **webRequestBlocking** ❌

**Status:** TIDAK DIGUNAKAN

**Analisis:**
Setelah memeriksa seluruh kode sumber ekstensi, izin `webRequestBlocking` tidak ditemukan digunakan di mana pun dalam implementasi.

**Rekomendasi:** **HAPUS dari manifest**

**Alasan:**
- Izin ini sangat powerful (dapat memblokir dan memodifikasi semua traffic jaringan)
- Tidak diperlukan untuk fungsi ekstensi saat ini
- Memicu warning keamanan tinggi saat instalasi
- Melanggar prinsip least privilege
- Dapat menghambat approval di Chrome Web Store

**Action required:**
```json
// Hapus dari manifest-chrome.json
"permissions": [
  "alarms",
  "contextMenus",
  "tabs",
  "storage"
  // HAPUS INI:
  // "webRequestBlocking"
]
```

---

## 📋 TEMPLATE PENGISIAN CHROME WEB STORE

Copy paste justifikasi di bawah ke form Chrome Web Store di tab **Praktik Privasi**:

### Untuk izin **alarms**:

```
Digunakan untuk fitur tab suspender yang menghemat memori browser. Ekstensi membuat alarm berkala setiap 1 menit untuk memeriksa tab mana yang sudah tidak aktif dan perlu ditangguhkan. Ini membantu mahasiswa yang membuka banyak tab untuk kuliah online agar browser tidak boros RAM. Tidak ada data pribadi yang dikumpulkan dari izin ini.
```

### Untuk izin **contextMenus**:

```
Digunakan untuk menambahkan menu pintasan di klik-kanan browser, yaitu opsi "Suspend this tab" untuk menunda tab secara manual dan "Close all suspended tabs" untuk menutup semua tab yang ditangguhkan. Ini memberikan kemudahan akses tanpa harus membuka popup ekstensi. Tidak ada data pribadi yang dikumpulkan dari izin ini.
```

### Untuk izin **tabs**:

```
Izin ini diperlukan untuk berbagai fitur inti ekstensi:

1. Tab Suspender: Menghemat memori dengan menangguhkan tab yang tidak aktif. Ekstensi memeriksa status tab dan melindungi data dengan mendeteksi form yang belum disimpan.

2. Portal Kampus Enhancement: Menyuntikkan dark mode, tema kustom, dan UI improvements ke portal SIAP Undip dan sistem pembelajaran kampus.

3. Otomasi Form: Auto-fill evaluasi dosen (PBM) dan form pendaftaran food truck untuk menghemat waktu mahasiswa.

4. Privasi: Blur informasi sensitif (nama, NIM, nilai) saat sharing screen.

5. Parsing Data: Membaca jadwal kuliah dari halaman SIAP untuk ditampilkan dalam ekstensi.

PENTING: Ekstensi HANYA mengakses konten halaman pada domain kampus yang diizinkan (siap.undip.ac.id, learn-social.undip.ac.id, dll). Semua data disimpan lokal, tidak ada data yang dikirim ke server eksternal, dan tidak ada tracking browsing history.
```

### Untuk izin **webRequest** dan **webRequestBlocking**:

```
⚠️ JANGAN ISIKAN JUSTIFIKASI - HAPUS IZIN INI DARI MANIFEST

Kedua izin ini tidak digunakan dalam kode dan harus dihapus dari manifest.json sebelum submit ke Chrome Web Store.
```

---

## 🔧 ACTION ITEMS SEBELUM SUBMIT

1. ✅ **WAJIB: Update manifest.json**
   - Hapus `"webRequest"` dari array permissions
   - Hapus `"webRequestBlocking"` dari array permissions

2. ✅ **Pastikan host_permissions sudah benar**
   - Hanya request akses ke domain kampus yang benar-benar digunakan
   - Contoh: `"https://siap.undip.ac.id/*"`

3. ✅ **Isi Privacy Policy**
   - Jelaskan bahwa tidak ada data yang dikirim ke server eksternal
   - Semua data disimpan lokal
   - Tidak ada tracking atau analytics

4. ✅ **Screenshot & Store Listing**
   - Tampilkan fitur tab suspender
   - Tampilkan dark mode untuk portal kampus
   - Tampilkan job tracker dan fitur lainnya

---

## 📞 KONTAK

Jika reviewer Chrome Web Store memiliki pertanyaan lebih lanjut tentang penggunaan izin, siap untuk memberikan:
- Screenshot kode yang menggunakan setiap izin
- Video demo showing fitur yang memerlukan setiap izin
- Penjelasan teknis lebih detail

---

**Terakhir diperbarui:** 2 November 2025
**Versi Ekstensi:** 1.4.2
