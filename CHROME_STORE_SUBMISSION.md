# 🚀 Panduan Submisi Chrome Web Store

## ✅ Status: Siap untuk Submit!

Manifest telah diperbaiki dengan menghapus permission `webRequest` dan `webRequestBlocking` yang tidak digunakan.

---

## 📋 Copy-Paste untuk Form "Praktik Privasi"

Saat mengisi form Chrome Web Store, Anda akan diminta justifikasi untuk setiap permission. Berikut adalah teks yang siap untuk di-copy-paste:

### 1️⃣ Justifikasi untuk **alarms**

```
Digunakan untuk fitur tab suspender yang menghemat memori browser. Ekstensi membuat alarm berkala setiap 1 menit untuk memeriksa tab mana yang sudah tidak aktif dan perlu ditangguhkan. Ini membantu mahasiswa yang membuka banyak tab untuk kuliah online agar browser tidak boros RAM. Tidak ada data pribadi yang dikumpulkan dari izin ini.
```

---

### 2️⃣ Justifikasi untuk **contextMenus**

```
Digunakan untuk menambahkan menu pintasan di klik-kanan browser, yaitu opsi "Suspend this tab" untuk menunda tab secara manual dan "Close all suspended tabs" untuk menutup semua tab yang ditangguhkan. Ini memberikan kemudahan akses tanpa harus membuka popup ekstensi. Tidak ada data pribadi yang dikumpulkan dari izin ini.
```

---

### 3️⃣ Justifikasi untuk **tabs**

```
Izin ini diperlukan untuk berbagai fitur inti ekstensi:

1. Tab Suspender: Menghemat memori dengan menangguhkan tab yang tidak aktif. Ekstensi memeriksa status tab dan melindungi data dengan mendeteksi form yang belum disimpan.

2. Portal Kampus Enhancement: Menyuntikkan dark mode, tema kustom, dan UI improvements ke portal SIAP Undip dan sistem pembelajaran kampus.

3. Otomasi Form: Auto-fill evaluasi dosen (PBM) dan form pendaftaran food truck untuk menghemat waktu mahasiswa.

4. Privasi: Blur informasi sensitif (nama, NIM, nilai) saat sharing screen.

5. Parsing Data: Membaca jadwal kuliah dari halaman SIAP untuk ditampilkan dalam ekstensi.

PENTING: Ekstensi HANYA mengakses konten halaman pada domain kampus yang diizinkan (siap.undip.ac.id, learn-social.undip.ac.id, dll). Semua data disimpan lokal, tidak ada data yang dikirim ke server eksternal, dan tidak ada tracking browsing history.
```

---

## 🔒 Privacy Policy (Wajib untuk Extensions)

Chrome Web Store memerlukan Privacy Policy. Berikut template yang bisa Anda gunakan:

```markdown
# Privacy Policy - Siap Dips: Your Campus Companion

**Last Updated:** [Tanggal hari ini]

## Data Collection

Siap Dips does NOT collect, store, or transmit any personal data to external servers.

## What Data is Stored Locally

All data is stored locally on your device using Chrome's storage API:
- User preferences (dark mode settings, themes)
- Tab suspension settings (timeout duration, excluded URLs)
- Parsed class schedules (from SIAP Undip pages)
- Job tracking data (only stored locally)

## Permissions Usage

- **alarms**: Used for periodic tab checking (tab suspender feature)
- **contextMenus**: Adds right-click menu options for tab management
- **tabs**: Required for tab suspension, dark mode injection, and form automation
- **storage**: Stores user preferences locally
- **activeTab**: Accesses current tab to apply themes and features
- **scripting**: Injects dark mode and UI enhancements

## Host Permissions

The extension only accesses content on:
- siap.undip.ac.id
- learn-social.undip.ac.id
- form.undip.ac.id
- Other UNDIP campus domains

These permissions are necessary to provide dark mode, custom themes, and productivity features.

## Third-Party Services

This extension does NOT:
- Send data to third-party servers
- Track your browsing history
- Use analytics or telemetry
- Share your information with anyone

## Contact

For questions about privacy, contact: [email Anda]

## Changes to This Policy

We will update this policy if our data practices change. Check this page for updates.
```

**📍 Hosting Privacy Policy:**
- Upload file privacy.html ke website Anda (misalnya: myudak.com/siap-dips/privacy)
- Atau gunakan GitHub Pages (buat repo public, upload ke docs/privacy.md)
- Link privacy policy akan diminta saat submisi Chrome Web Store

---

## 📸 Screenshot Requirements

Chrome Web Store memerlukan minimal 1 screenshot (maksimal 5). Recommended screenshots:

1. **Screenshot 1: Popup Utama**
   - Tampilkan extension popup dengan fitur-fitur utama
   - Highlight tab suspender controls

2. **Screenshot 2: Dark Mode SIAP Undip**
   - Sebelum/sesudah dark mode diaktifkan
   - Tunjukkan improvement UI

3. **Screenshot 3: Tab Suspender in Action**
   - Tampilkan tab yang suspended
   - Tampilkan memory savings

4. **Screenshot 4: Job Tracker**
   - Tampilkan fitur job tracking
   - Tunjukkan list of jobs

5. **Screenshot 5: Settings Page**
   - Tampilkan berbagai opsi kustomisasi
   - Theme selector, privacy settings, dll

**Ukuran Screenshot:**
- Minimal: 640 x 400 pixels
- Maksimal: 1280 x 800 pixels
- Rasio aspect: 16:10 atau 4:3

---

## 📝 Store Listing Information

### Short Description (maksimal 132 karakter)
```
Tingkatkan pengalaman SIAP Undip dengan dark mode, tab suspender, auto-fill form, job tracker, dan banyak lagi!
```

### Detailed Description (contoh)
```
🎓 Siap Dips: Your Campus Companion

Extension Chrome resmi untuk mahasiswa Undip yang ingin meningkatkan produktivitas dan pengalaman menggunakan portal kampus.

✨ FITUR UTAMA:

🌙 Dark Mode untuk SIAP Undip
- Mata lebih nyaman saat belajar malam
- Custom themes untuk personalisasi
- Support untuk Learn Social dan Moodle

💾 Tab Suspender (Penghemat Memori)
- Otomatis suspend tab yang tidak digunakan
- Hemat RAM hingga 95% per tab
- Proteksi form: tidak akan suspend tab dengan input yang belum disimpan
- Auto-close tab yang sudah terlalu lama di-suspend

⚡ Otomasi Formulir
- Auto-fill PBM (evaluasi dosen) dengan 1 klik
- Auto-fill form food truck kampus
- Hemat waktu untuk form berulang

📋 Job Tracker
- Lacak aplikasi pekerjaan Anda
- Support 20+ job boards (LinkedIn, JobStreet, dll)
- Simpan semua data lokal di device Anda

🔒 Privacy Features
- Blur nama, NIM, dan nilai saat sharing screen
- Tidak ada data yang dikirim ke server eksternal
- Semua data tersimpan lokal

📚 Fitur Lainnya:
- Parse jadwal kuliah otomatis
- QR scanner untuk absensi
- Custom UI improvements
- Notifikasi toast yang informatif

🎯 SIAPA YANG MEMBUTUHKAN?

Mahasiswa Undip yang:
- Sering buka banyak tab (SIAP, Learn Social, jurnal, dll)
- Ingin dark mode untuk mata lebih nyaman
- Malas isi PBM satu-satu
- Aktif apply pekerjaan dan butuh tracker
- Ingin laptop tidak lemot karena kebanyakan tab

💡 OPEN SOURCE
Kode sumber tersedia di GitHub. Kontribusi welcome!

🔐 PRIVASI & KEAMANAN
- Zero tracking
- Zero analytics
- Zero data collection
- Semua data tersimpan lokal di device Anda

Developed with ❤️ by myudakk
```

---

## ⚙️ Technical Information

### Category
- **Productivity** (kategori utama)

### Languages
- Indonesian (Bahasa Indonesia)
- English

### Version
- 1.4.2 (sesuai manifest.json Anda)

---

## 🚨 Pre-Submission Checklist

Sebelum submit, pastikan:

- [x] ✅ Permission `webRequest` dan `webRequestBlocking` sudah dihapus
- [ ] 📸 Upload minimal 1 screenshot (maks 5)
- [ ] 🔗 Upload Privacy Policy ke website/GitHub Pages
- [ ] 🎨 Icon extension sudah siap (16x16, 48x48, 128x128)
- [ ] 📝 Store listing description sudah disiapkan
- [ ] 🧪 Test extension di fresh Chrome install
- [ ] 📦 Build extension: `npm run build` atau script build Anda
- [ ] 🗜️ Zip folder hasil build (dist/ atau build/)

---

## 📦 Build & Package

### Build Extension
```bash
# Pastikan dependencies terinstall
npm install

# Build untuk production
npm run build
# atau
npm run build:chrome
```

### Package untuk Upload
```bash
# Zip folder dist/
cd dist
zip -r ../siap-dips-v1.4.2.zip ./*

# Atau gunakan GUI:
# Klik kanan folder dist/ -> Send to -> Compressed (zipped) folder
```

**⚠️ PENTING:** Pastikan yang di-zip adalah **ISI** folder dist/, bukan folder dist/ itu sendiri.

**Struktur ZIP yang benar:**
```
siap-dips-v1.4.2.zip
├── manifest.json
├── background.js
├── popup.html
├── icons/
├── content.js
└── ...
```

**Struktur ZIP yang SALAH:**
```
siap-dips-v1.4.2.zip
└── dist/
    ├── manifest.json
    ├── background.js
    └── ...
```

---

## 🌐 Chrome Web Store Developer Dashboard

### URL Dashboard
https://chrome.google.com/webstore/devconsole

### Langkah Submit

1. **Login** ke Chrome Web Store Developer Dashboard
2. **Pay one-time fee** ($5 USD) jika belum pernah
3. Klik **"New Item"**
4. Upload file **ZIP** hasil build
5. Isi informasi:
   - Store listing (description, screenshots)
   - Privacy practices (justifikasi permissions)
   - Link ke Privacy Policy
   - Categories & languages
6. **Submit for review**

### Waktu Review
- Biasanya 1-3 hari kerja
- Bisa lebih lama jika banyak permissions (dalam kasus Anda sudah aman karena permission minimal)

---

## 🆘 Troubleshooting

### Jika Rejected karena Permission Issues

Jika masih ditanya soal `webRequest` atau `webRequestBlocking`:
1. Double-check file manifest.json di dalam ZIP
2. Pastikan sudah rebuild setelah edit manifest
3. Re-zip dan re-upload

### Jika Diminta Justifikasi Lebih Detail

Gunakan file **PERMISSION_JUSTIFICATIONS_ID.md** yang sudah dibuat. File itu berisi:
- Penjelasan teknis setiap permission
- Lokasi kode yang menggunakan permission (file & line number)
- Screenshot code jika diperlukan

---

## 📞 Support

Jika ada pertanyaan dari Chrome Web Store reviewer:
- Siap jawab dengan referensi ke dokumentasi yang sudah dibuat
- Tunjukkan kode di GitHub (jika public repo)
- Berikan video demo jika diminta

---

## ✨ After Approval

Setelah approved:
1. Share link Chrome Web Store di socials
2. Update README.md dengan badge Chrome Web Store
3. Monitor reviews dan feedback pengguna
4. Update extension sesuai feedback

---

**Good luck dengan submission! 🚀**

Jika ada pertanyaan, feel free to ask!

---

**Files Created for Submission:**
- ✅ `EXTENSION_DOCUMENTATION.md` - Technical docs (English)
- ✅ `PERMISSION_JUSTIFICATIONS_ID.md` - Permission justifications (Indonesian)
- ✅ `CHROME_STORE_SUBMISSION.md` - This file (submission guide)
- ✅ `manifest-chrome.json` - Fixed (webRequest removed)
- ✅ `manifest-firefox.json` - Fixed (webRequest removed)
