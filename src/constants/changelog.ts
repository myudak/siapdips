export interface ChangelogEntry {
  version: string;
  date: string;
  type: "feature" | "bugfix" | "initial" | "patch";
  changes: string[];
}

// Shared by the options page changelog and the public landing page.
export const changelogEntries: ChangelogEntry[] = [
  {
    version: "v1.5.4",
    date: "October 29, 2026",
    type: "bugfix",
    changes: [
      "Full-page screenshot mendukung halaman panjang tanpa batas 120 potongan",
      "Progres capture dan penyusunan gambar ditampilkan; editor hanya terbuka setelah capture berhasil",
      "Potongan gambar disesuaikan sebelum disimpan agar penggunaan memori lebih stabil",
    ],
  },
  {
    version: "v1.5.3",
    date: "October 29, 2026",
    type: "bugfix",
    changes: [
      "Volume booster memakai ulang sesi audio dan menunggu capture lama berhenti",
      "Stream dibersihkan jika inisialisasi audio gagal; konflik capture menampilkan langkah pemulihan",
    ],
  },
  {
    version: "v1.5.2",
    date: "October 29, 2026",
    type: "patch",
    changes: [
      "Ikon toolbar lebih besar dengan simbol ungu transparan yang memenuhi area ikon",
    ],
  },
  {
    version: "v1.5.1",
    date: "October 29, 2026",
    type: "patch",
    changes: [
      "Logo hitam–ungu baru untuk ikon browser, popup, options, dan helper halaman",
      "Branding landing page, favicon, dan README disamakan dengan ikon baru",
    ],
  },
  {
    version: "v1.5.0",
    date: "October 29, 2026",
    type: "feature",
    changes: [
      "Tools etc: speed control, volume booster Chrome/Edge, PiP, dan A–B loop",
      "Screenshot full page/area dengan editor crop dan blur lokal",
      "FontWhat, warna elemen, blur privasi, reading ruler, dan salin link bersih",
      "Izin situs opsional untuk mengingat speed; urutan kartu lama tetap tersimpan",
    ],
  },
  {
    version: "v1.4.1059",
    date: "October 29, 2026",
    type: "feature",
    changes: [
      "Siedu: helper EduLangua dengan Auto Voice dan catatan",
      "Kartu Notes untuk menyimpan dan mengatur catatan",
    ],
  },
  {
    version: "v1.4.1058",
    date: "June 9, 2026",
    type: "feature",
    changes: [
      "Helper quiz Moodle bisa pakai ChatGPT",
      "Perbaikan helper di Firefox",
      "Rilis otomatis ke Chrome, Firefox, dan Edge",
    ],
  },
  {
    version: "v1.4.9",
    date: "June 15, 2025",
    type: "feature",
    changes: [
      "Upload Absen Image",
      "Moodle Kulon helper",
      "DIPS AI Helper ( •̀ ω •́ )✧",
      "better mobile layout",
    ],
  },
  {
    version: "v1.3.0",
    date: "March 14, 2025",
    type: "feature",
    changes: [
      "TODO Board",
      "Fix Thememode {change from radix to own}",
      "React compilerr ヾ(≧ ▽ ≦)ゝ ",
    ],
  },
  {
    version: "v1.2.0",
    date: "March 7, 2025",
    type: "feature",
    changes: [
      "Food Truk Helper {beta}",
      "Navcard setting",
      "Patch Learn Social Helper",
    ],
  },
  {
    version: "v1.1.1",
    date: "February 27, 2025",
    type: "patch",
    changes: ["Better Jadwal Dips", "Bugfixes"],
  },
  {
    version: "v1.1.0",
    date: "February, 2025",
    type: "feature",
    changes: [
      "Auto Learn Social",
      "Jadwal Dips",
      "Quality of Life improvements",
    ],
  },
  {
    version: "v1.0.0",
    date: "2025",
    type: "initial",
    changes: ["Core features", "Ipk, Dark mode, Auto PBM etc"],
  },
];
