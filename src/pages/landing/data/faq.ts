export type FaqItem = {
  question: string;
  answer: string;
};

// Answers are plain text so they can be reused as-is in FAQPage structured data.
export const faqItems: FaqItem[] = [
  {
    question: "Siap Dips itu apa?",
    answer:
      "Siap Dips adalah extension browser gratis buat mahasiswa Undip. Isinya helper kecil untuk SIAP, SSO, Kulon, dan halaman kampus lain: jadwal di popup, dark mode, Auto PBM, absen QR dari gambar, Todoist sync, dan lainnya.",
  },
  {
    question: "Ini aplikasi resmi Undip?",
    answer:
      "Bukan. Siap Dips dibuat oleh mahasiswa dan tidak terafiliasi dengan Universitas Diponegoro. Portal kampus tetap jalan seperti biasa, Siap Dips cuma menambahkan helper di browser kamu.",
  },
  {
    question: "Gratis?",
    answer:
      "Gratis. Tanpa akun, tanpa iklan, dan tanpa analytics.",
  },
  {
    question: "Data saya disimpan di mana?",
    answer:
      "Pengaturan, jadwal, cache tugas, dan token opsional disimpan di storage extension di browser kamu. Siap Dips tidak punya server yang menerima data kamu. Integrasi seperti Todoist atau AI hanya jalan kalau kamu sendiri yang mengisi token, dan datanya dikirim langsung ke layanan itu.",
  },
  {
    question: "Kenapa izinnya minta akses ke banyak situs?",
    answer:
      "Helper perlu jalan di halaman tempat fiturnya dipakai: situs *.undip.ac.id, LearnSocial, form Food Truck, dan situs lowongan untuk Job Tracker. Ada juga skrip kecil di semua halaman yang mendeteksi form yang belum disimpan, supaya tab suspender tidak menidurkan tab yang sedang kamu isi.",
  },
  {
    question: "Bisa dipakai di browser apa aja?",
    answer:
      "Chrome, Firefox, dan Microsoft Edge di laptop atau PC. Brave dan browser berbasis Chromium lain biasanya bisa install dari Chrome Web Store. Browser di HP umumnya belum mendukung extension seperti ini.",
  },
  {
    question: "Gimana cara update?",
    answer:
      "Otomatis lewat toko browser. Kalau mau cek versi terbaru, lihat bagian changelog di halaman ini.",
  },
  {
    question: "Ada fitur yang nggak jalan, harus gimana?",
    answer:
      "Refresh dulu halaman kampusnya, lalu pastikan fiturnya aktif di popup. Kalau masih bermasalah, laporkan lewat GitHub Issues dengan menyebut browser, halaman, dan langkah yang kamu lakukan.",
  },
];
