import {
  BookOpenCheck,
  BriefcaseBusiness,
  CalendarDays,
  ClipboardCheck,
  Download,
  GraduationCap,
  LayoutGrid,
  ListChecks,
  MousePointerClick,
  MoonStar,
  QrCode,
  Sparkles,
  Ticket,
  TimerReset,
  Utensils,
  type LucideIcon,
} from "lucide-react";
import { screens, video, type Screen, type Video } from "./site";

export type TutorialCategory =
  | "mulai"
  | "akademik"
  | "kulon"
  | "kampus"
  | "produktivitas";

export const tutorialCategories: Record<
  TutorialCategory,
  { label: string; description: string }
> = {
  mulai: {
    label: "Mulai",
    description: "Install, pin, dan atur popup sesuai kebutuhan kamu.",
  },
  akademik: {
    label: "SIAP & akademik",
    description: "Jadwal, IPK, PBM, absen, dan tampilan portal SIAP.",
  },
  kulon: {
    label: "Kulon & belajar",
    description: "Helper Moodle Kulon, AI, Todoist, dan LearnSocial.",
  },
  kampus: {
    label: "Kampus & event",
    description: "Form dan halaman yang sering rebutan waktu.",
  },
  produktivitas: {
    label: "Browser & produktivitas",
    description: "Helper browser yang kepake di luar urusan kampus juga.",
  },
};

export type TutorialStep = {
  title: string;
  body: string;
};

export type Tutorial = {
  slug: string;
  /** Short name used in cards, nav and breadcrumbs. */
  name: string;
  /** H1 on the tutorial page; phrased like what people search for. */
  title: string;
  /** <title> tag, kept under ~60 characters including the site suffix. */
  seoTitle: string;
  /** Meta description, kept under ~155 characters. */
  description: string;
  intro: string;
  category: TutorialCategory;
  icon: LucideIcon;
  minutes: number;
  sites: string[];
  video?: Video;
  extraVideo?: Video;
  screen?: Screen;
  steps: TutorialStep[];
  tips?: string[];
  related: string[];
  featured?: boolean;
};

// Step text supports **bold** for on-screen labels and `code` for URLs.
export const tutorials: Tutorial[] = [
  {
    slug: "install",
    name: "Install & pin",
    title: "Cara install Siap Dips di Chrome, Firefox, dan Edge",
    seoTitle: "Cara Install Siap Dips di Chrome, Firefox & Edge",
    description:
      "Panduan install extension Siap Dips buat mahasiswa Undip di Chrome, Firefox, atau Edge, lalu pin ikonnya biar popup gampang dibuka.",
    intro:
      "Siap Dips itu extension browser, jadi cukup install sekali dari toko resmi browser kamu. Gratis, tanpa akun, dan update-nya jalan otomatis.",
    category: "mulai",
    icon: Download,
    minutes: 2,
    sites: ["Chrome Web Store", "Firefox Add-ons", "Edge Add-ons"],
    screen: screens.popupDashboard,
    steps: [
      {
        title: "Buka halaman Siap Dips di toko browser kamu",
        body: "Pakai Chrome Web Store buat Chrome (juga Brave dan browser Chromium lain), Firefox Add-ons buat Firefox, atau Edge Add-ons buat Microsoft Edge. Link ketiganya ada di bawah halaman ini.",
      },
      {
        title: "Klik tombol install",
        body: "Klik **Add to Chrome**, **Add to Firefox**, atau **Get**, lalu setujui izinnya. Izin dipakai biar helper bisa jalan di halaman kampus seperti `siap.undip.ac.id` dan `kulon2.undip.ac.id`.",
      },
      {
        title: "Pin ikon Siap Dips ke toolbar",
        body: "Di Chrome dan Edge, klik ikon puzzle di toolbar lalu klik pin di sebelah Siap Dips. Di Firefox, buka menu Extensions, klik ikon gear di Siap Dips, lalu pilih **Pin to Toolbar**.",
      },
      {
        title: "Buka dashboard SIAP sekali",
        body: "Login dan buka `siap.undip.ac.id` seperti biasa. Siap Dips membaca nama, foto profil, dan IPK dari dashboard buat ditampilkan di popup. Semuanya disimpan di browser kamu.",
      },
      {
        title: "Klik ikon Siap Dips",
        body: "Popup kebuka dengan kartu-kartu fitur. Lanjut ke tutorial atur kartu popup kalau mau merapikan urutannya.",
      },
    ],
    tips: [
      "Update otomatis lewat toko browser. Kamu nggak perlu download ulang.",
      "Pengaturan, cache, dan token opsional disimpan di storage extension di browser kamu, bukan di server Siap Dips.",
    ],
    related: ["atur-popup", "jadwal", "tema-dark-mode"],
    featured: true,
  },
  {
    slug: "atur-popup",
    name: "Atur kartu popup",
    title: "Cara atur, urutkan, dan sembunyikan kartu di popup Siap Dips",
    seoTitle: "Atur Kartu Popup Siap Dips: Urutkan & Sembunyikan",
    description:
      "Popup Siap Dips punya belasan kartu. Begini cara mengurutkan, menyembunyikan, dan memunculkan lagi kartu biar popup cuma berisi yang kamu pakai.",
    intro:
      "Popup Siap Dips berisi belasan kartu, dari Quick Access sampai Job Tracker. Kamu bebas memilih mana yang tampil dan urutannya.",
    category: "mulai",
    icon: LayoutGrid,
    minutes: 2,
    sites: ["Popup Siap Dips", "Halaman pengaturan"],
    screen: screens.popupDashboard,
    steps: [
      {
        title: "Geser kartu lewat pegangannya",
        body: "Tiap kartu punya pegangan kecil (ikon titik-titik) di bagian atas. Tarik pegangan itu ke atas atau ke bawah. Urutan baru langsung tersimpan.",
      },
      {
        title: "Sembunyikan kartu yang nggak kepake",
        body: "Arahkan kursor ke kartu, lalu klik tombol hide yang muncul di pojoknya. Notifikasi **Card hidden** muncul, dan kamu bisa klik **Undo** kalau salah pencet.",
      },
      {
        title: "Munculkan lagi dari halaman pengaturan",
        body: "Di halaman pengaturan Siap Dips, bagian paling atas berisi daftar semua kartu. Klik kartu yang tersembunyi buat menampilkannya lagi, atau pakai **Reset** buat balik ke susunan awal.",
      },
      {
        title: "Atur link Quick Access",
        body: "Kartu **Quick Access** berisi pintasan ke SSO, SIAP, Absensi, Kulon, HALO, dan LearnSocial. Link-nya bisa diatur dari bagian Quick Access di halaman pengaturan.",
      },
    ],
    related: ["install", "jadwal", "ipk"],
  },
  {
    slug: "jadwal",
    name: "Jadwal kuliah",
    title: "Cara lihat jadwal kuliah SIAP Undip langsung dari popup",
    seoTitle: "Jadwal Kuliah SIAP Undip Langsung di Popup",
    description:
      "Ambil jadwal kuliah dari SIAP Undip sekali, lalu lihat matkul hari ini, kemarin, dan besok langsung dari popup Siap Dips, lengkap dengan link MS Teams.",
    intro:
      "Kartu Jadwal Dips menampilkan matkul hari ini tanpa perlu buka SIAP. Kamu cukup ambil jadwalnya sekali tiap semester.",
    category: "akademik",
    icon: CalendarDays,
    minutes: 2,
    sites: ["siap.undip.ac.id/jadwal_mahasiswa"],
    video: video("vid-jadwal-2", "Video cara ambil jadwal kuliah SIAP dengan Siap Dips"),
    extraVideo: video("vid-jadwal", "Video tampilan kartu Jadwal Dips di popup"),
    steps: [
      {
        title: "Klik Retrieve Jadwal",
        body: "Di kartu **Jadwal Dips**, klik **Retrieve Jadwal**. Halaman `siap.undip.ac.id/jadwal_mahasiswa/mhs/jadwal` kebuka di tab baru.",
      },
      {
        title: "Tunggu halaman jadwal selesai dimuat",
        body: "Pastikan kamu sudah login SIAP. Begitu tabel jadwal tampil, Siap Dips membacanya dan menyimpan jadwal di browser kamu.",
      },
      {
        title: "Buka popup lagi",
        body: "Kartu sekarang menampilkan matkul hari ini. Pakai tombol panah buat pindah matkul, atau **Kemarin** dan **Besok** buat lihat hari lain.",
      },
      {
        title: "Masuk kelas online dengan sekali klik",
        body: "Kalau jadwal punya link Teams, tombol **MS Teams** langsung membuka kelasnya. Klik **Jadwal Full** buat lihat jadwal satu minggu.",
      },
    ],
    tips: [
      "Ganti semester atau ada perubahan jadwal? Klik **Retrieve Jadwal** lagi.",
      "Kalau kartu bilang **Gak Ada Jadwal**, berarti memang nggak ada kuliah di hari itu.",
    ],
    related: ["ipk", "auto-pbm", "qr-absen"],
    featured: true,
  },
  {
    slug: "ipk",
    name: "IPK status",
    title: "Cara tampilkan, edit, atau sembunyikan IPK di SIAP Undip",
    seoTitle: "Sembunyikan atau Edit Tampilan IPK di SIAP Undip",
    description:
      "Lihat IPK kamu di popup Siap Dips, blur IPK di dashboard SIAP, atau ganti teks yang tampil biar aman pas screen share atau presentasi.",
    intro:
      "Kartu IPK Status membaca IPK dari dashboard SIAP. Dari situ kamu bisa melihatnya cepat, atau menyembunyikannya kalau lagi share layar.",
    category: "akademik",
    icon: GraduationCap,
    minutes: 1,
    sites: ["siap.undip.ac.id/pages/mhs/dashboard"],
    video: video("vid-ipk", "Video cara edit dan sembunyikan IPK dengan Siap Dips"),
    steps: [
      {
        title: "Buka dashboard SIAP",
        body: "IPK kamu terbaca otomatis dari dashboard dan muncul di kartu **IPK STATUS**. Kalau kartu masih kosong, klik **Go to Undip**.",
      },
      {
        title: "Ganti teks IPK yang tampil",
        body: "Klik ikon pensil (**Edit IPK**) dan tulis teks lain, misalnya \"Kepo\". Dashboard SIAP akan menampilkan teks itu, bukan angka IPK kamu.",
      },
      {
        title: "Blur IPK",
        body: "Klik ikon mata buat mem-blur IPK di dashboard. Klik lagi buat menampilkannya.",
      },
      {
        title: "Kembalikan ke semula",
        body: "Klik **Reset IPK** buat balik ke angka IPK asli.",
      },
    ],
    tips: [
      "Perubahan ini cuma di tampilan browser kamu. Data di server SIAP tetap sama.",
    ],
    related: ["jadwal", "klik-kanan", "tema-dark-mode"],
  },
  {
    slug: "tema-dark-mode",
    name: "Tema & dark mode",
    title: "Cara aktifkan dark mode di SIAP, SSO, dan Kulon Undip",
    seoTitle: "Dark Mode SIAP, SSO & Kulon Undip",
    description:
      "Aktifkan dark mode atau warna tema sendiri di SIAP, SSO, dan Kulon Undip pakai Siap Dips. Lebih nyaman buat begadang ngerjain tugas.",
    intro:
      "Portal kampus default-nya terang banget. Kartu Undip Theme Settings bikin SIAP, SSO, dan Kulon pakai tema gelap atau warna pilihan kamu.",
    category: "akademik",
    icon: MoonStar,
    minutes: 1,
    sites: ["siap.undip.ac.id", "sso.undip.ac.id", "kulon2.undip.ac.id"],
    video: video("Vid-Theme", "Video cara mengganti tema dan dark mode portal Undip"),
    screen: screens.kulonDark,
    steps: [
      {
        title: "Nyalakan Enable Custom Themes",
        body: "Di kartu **Undip Theme Settings**, aktifkan switch **Enable Custom Themes**.",
      },
      {
        title: "Pilih Theme Mode",
        body: "Pilih **Dark** atau **Light** di bagian **Theme Mode**.",
      },
      {
        title: "Atur warna sendiri (opsional)",
        body: "Buka **Custom Color**, pilih warna, lalu cek hasilnya di **Preview** sebelum dipakai.",
      },
      {
        title: "Refresh portal kampus",
        body: "Buka atau refresh tab SIAP, SSO, atau Kulon. Tema baru langsung kepake.",
      },
    ],
    related: ["klik-kanan", "ipk", "moodle-helper"],
    featured: true,
  },
  {
    slug: "klik-kanan",
    name: "Klik kanan & popup SSO",
    title: "Cara aktifkan klik kanan dan copy, plus tutup popup SSO Undip",
    seoTitle: "Aktifkan Klik Kanan & Copy di Portal Undip",
    description:
      "Balikin klik kanan, copy, dan inspect di halaman yang memblokirnya, sembunyikan popup di dashboard SSO Undip, dan blur nama dosen wali.",
    intro:
      "Beberapa halaman kampus memblokir klik kanan dan copy. Kartu Lainnya berisi toggle kecil buat membereskan hal-hal begitu.",
    category: "akademik",
    icon: MousePointerClick,
    minutes: 1,
    sites: ["sso.undip.ac.id", "siap.undip.ac.id"],
    video: video("Vid-Klikkanan", "Video cara mengaktifkan klik kanan dengan Siap Dips"),
    screen: screens.popupLainnya,
    steps: [
      {
        title: "Buka kartu Lainnya",
        body: "Di popup, cari kartu dengan toggle **Hide pop up SSO**, **Enable klik kanan Copy**, dan **Blur Dosen Wali**.",
      },
      {
        title: "Aktifkan klik kanan",
        body: "Nyalakan **Enable klik kanan Copy**. Refresh halaman, lalu klik kanan, copy, dan inspect bisa dipakai lagi.",
      },
      {
        title: "Tutup popup SSO otomatis",
        body: "Nyalakan **Hide pop up SSO**. Popup pengumuman di `sso.undip.ac.id/pages/dashboard` nggak muncul lagi tiap login.",
      },
      {
        title: "Blur nama dosen wali",
        body: "Nyalakan **Blur Dosen Wali** kalau mau screenshot atau share layar SIAP tanpa menampilkan nama dosen wali.",
      },
    ],
    tips: [
      "Opsi lain ada di tombol **Advanced Settings** pada kartu yang sama.",
    ],
    related: ["tema-dark-mode", "ipk", "auto-pbm"],
  },
  {
    slug: "auto-pbm",
    name: "Auto PBM",
    title: "Cara isi evaluasi PBM SIAP Undip lebih cepat dengan Auto PBM",
    seoTitle: "Cara Isi PBM SIAP Undip Cepat dengan Auto PBM",
    description:
      "Isi evaluasi perkuliahan (PBM) di SIAP Undip pakai template jawaban sendiri. Sekali klik per mata kuliah, atau semua dosen sekaligus.",
    intro:
      "Evaluasi PBM wajib diisi tiap semester dan pertanyaannya banyak. Auto PBM mengisi jawaban sesuai template yang kamu atur sendiri.",
    category: "akademik",
    icon: ClipboardCheck,
    minutes: 2,
    sites: ["siap.undip.ac.id/evaluasi_perkuliahan"],
    video: video("Vid-Pbm", "Video cara mengisi evaluasi PBM dengan Auto PBM"),
    screen: screens.pbmPanel,
    steps: [
      {
        title: "Atur template jawaban",
        body: "Di kartu **Auto PBM**, klik **Setting Template**. Halaman **Template PBM** kebuka. Pilih jawaban default buat tiap pertanyaan. Perubahan tersimpan otomatis.",
      },
      {
        title: "Buka halaman evaluasi",
        body: "Klik **Goto PBM**. Halaman `siap.undip.ac.id/evaluasi_perkuliahan/mhs/evaluasi` kebuka dan panel Siap Dips muncul di atas form.",
      },
      {
        title: "Isi satu mata kuliah",
        body: "Buka form evaluasi salah satu matkul, lalu klik **~Auto This~** di panel (atau di popup). Jawaban terisi sesuai template.",
      },
      {
        title: "Atau isi semua dosen sekaligus",
        body: "Klik **~Auto All~** buat mengisi semua dosen. Kalau **Auto Submit** dicentang, form langsung dikirim, jadi matikan dulu kalau mau mengecek jawaban.",
      },
    ],
    tips: [
      "Klik **Clear** di panel buat mengosongkan jawaban yang sudah terisi.",
      "Isi template sesuai pendapat kamu. Evaluasi PBM dibaca dosen dan prodi.",
    ],
    related: ["jadwal", "qr-absen", "klik-kanan"],
    featured: true,
  },
  {
    slug: "qr-absen",
    name: "QR absen",
    title: "Cara absen QR SIAP Undip pakai upload gambar",
    seoTitle: "Absen QR SIAP Undip dari Gambar (Tanpa Kamera)",
    description:
      "Laptop nggak ada kamera atau kamera susah fokus ke proyektor? Upload foto atau screenshot QR absen, Siap Dips membaca kodenya dan membuka link absen SIAP.",
    intro:
      "Scanner absensi SIAP butuh kamera. Kalau kamera bermasalah, kamu bisa upload foto QR dan Siap Dips membaca kodenya.",
    category: "akademik",
    icon: QrCode,
    minutes: 1,
    sites: ["siap.undip.ac.id/master_perkuliahan/mhs/absensi"],
    steps: [
      {
        title: "Foto atau screenshot QR dari dosen",
        body: "Pastikan QR terlihat utuh dan nggak blur.",
      },
      {
        title: "Upload dari popup",
        body: "Di kartu **QR Code Reader**, klik **Upload QR Absen** dan pilih gambarnya. Kode yang terbaca muncul di bawah tulisan **Code:**.",
      },
      {
        title: "Klik Absen",
        body: "Klik **Absen**. Link absen SIAP untuk kode itu kebuka di tab baru, tinggal ikuti prosesnya seperti biasa.",
      },
      {
        title: "Atau langsung dari halaman scanner",
        body: "Di halaman scanner absensi SIAP, Siap Dips menambahkan tombol **Upload QR Absen** yang bisa langsung dipakai.",
      },
    ],
    tips: [
      "Absen tetap pakai akun SIAP kamu sendiri, dan aturan kehadiran dari dosen tetap berlaku.",
    ],
    related: ["jadwal", "auto-pbm", "install"],
  },
  {
    slug: "moodle-helper",
    name: "Moodle helper & Tany AI",
    title: "Cara pakai Moodle helper dan Tany AI di Kulon Undip",
    seoTitle: "Moodle Helper & Tany AI di Kulon Undip",
    description:
      "Atur provider AI (Gemini atau OpenAI-compatible) di Siap Dips, lalu pakai Google Soal, Copy Soal, dan Tany AI (Alt+A) di halaman quiz Kulon.",
    intro:
      "Di halaman quiz Kulon, Siap Dips menambahkan tombol kecil buat mencari, menyalin, atau menanyakan soal ke AI. AI-nya pakai API key kamu sendiri.",
    category: "kulon",
    icon: Sparkles,
    minutes: 4,
    sites: ["kulon2.undip.ac.id/mod/quiz"],
    screen: screens.kulonDark,
    steps: [
      {
        title: "Buka Moodle AI Settings",
        body: "Di kartu **Moodle Helper Settings**, klik **Settings**. Bagian **Moodle AI Settings** di halaman pengaturan kebuka.",
      },
      {
        title: "Pilih provider",
        body: "Pilih **Gemini**, **OpenAI-Compatible**, atau **CLIProxy (Local)** di **Active Provider**, lalu isi API key dan model. API key Gemini bisa dibuat gratis di Google AI Studio.",
      },
      {
        title: "Tes koneksi lalu simpan",
        body: "Klik tombol tes. Kalau muncul **connection OK**, simpan pengaturannya.",
      },
      {
        title: "Buka quiz di Kulon",
        body: "Di halaman quiz, tiap soal punya tombol **Google Soal** buat mencari di Google, **Copy Soal** buat menyalin teks soal, dan **Tany AI** buat minta penjelasan.",
      },
      {
        title: "Pakai shortcut",
        body: "Tekan **Alt+A** buat Tany AI tanpa klik tombol, dan **Alt+N** buat pindah ke halaman berikutnya.",
      },
    ],
    tips: [
      "Kartu **AI Chat** di popup memakai provider yang sama, jadi kamu juga bisa chat di luar quiz.",
      "API key disimpan di browser kamu dan dikirim langsung ke provider yang kamu pilih.",
      "Pakai sesuai aturan dosen dan kampus. Kalau quiz-nya melarang bantuan, jangan dipakai.",
    ],
    related: ["todoist-sync", "tema-dark-mode", "learnsocial"],
    featured: true,
  },
  {
    slug: "todoist-sync",
    name: "Todoist sync",
    title: "Cara sinkron tugas Kulon Undip ke Todoist",
    seoTitle: "Sinkron Tugas Kulon Undip ke Todoist",
    description:
      "Kirim deadline tugas dari dashboard Kulon Undip ke project Todoist kamu. Atur API token sekali, lalu sync tiap ada tugas baru.",
    intro:
      "Kalau kamu pakai Todoist buat to-do, Siap Dips bisa mengirim tugas dan deadline dari Kulon ke project Todoist pilihanmu.",
    category: "kulon",
    icon: ListChecks,
    minutes: 3,
    sites: ["kulon2.undip.ac.id/my", "todoist.com"],
    steps: [
      {
        title: "Ambil API token Todoist",
        body: "Di Todoist, buka Settings, Integrations, lalu Developer. Salin API token kamu.",
      },
      {
        title: "Simpan token di Siap Dips",
        body: "Di kartu **Todoist Sync**, klik **Configure Todoist**. Tempel token di **API Token** lalu simpan.",
      },
      {
        title: "Pilih project",
        body: "Klik **Fetch Projects**, lalu pilih project tujuan di **Select Project**. Centang **Ignore Overdue Tasks** kalau tugas yang lewat deadline nggak perlu ikut.",
      },
      {
        title: "Buka dashboard Kulon lalu sync",
        body: "Buka `kulon2.undip.ac.id/my/`, lalu klik tombol sync di kartu **Todoist Sync**. Tugas masuk ke Todoist lengkap dengan deadline-nya.",
      },
    ],
    tips: [
      "Token cuma disimpan di browser kamu. Hapus kapan saja dengan **Clear All Settings**.",
    ],
    related: ["moodle-helper", "jadwal", "tab-suspender"],
  },
  {
    slug: "learnsocial",
    name: "LearnSocial helper",
    title: "Cara pakai helper LearnSocial Undip",
    seoTitle: "Helper LearnSocial Undip dengan Siap Dips",
    description:
      "Pasang helper Siap Dips di undip.learnsocial.online biar materi dan tugas harian di LearnSocial lebih cepat dikerjakan.",
    intro:
      "LearnSocial dipakai di beberapa matkul umum. Helper Siap Dips muncul di halaman LearnSocial dan bisa ditambahkan dari popup.",
    category: "kulon",
    icon: BookOpenCheck,
    minutes: 2,
    sites: ["undip.learnsocial.online"],
    video: video("vid-learnsocial", "Video cara memakai helper LearnSocial"),
    steps: [
      {
        title: "Buka LearnSocial",
        body: "Di kartu **Auto Learn Social**, klik **Goto Undip Learn Social** lalu login seperti biasa.",
      },
      {
        title: "Tambahkan helper",
        body: "Di tab LearnSocial, buka popup dan klik **~Add~**. Panel helper Siap Dips muncul di halaman.",
      },
      {
        title: "Ikuti petunjuk di panel",
        body: "Panel bisa digeser kalau menutupi konten. Tonton video di atas buat contoh alurnya.",
      },
    ],
    related: ["moodle-helper", "todoist-sync", "foodtruk"],
  },
  {
    slug: "foodtruk",
    name: "FoodTruk helper",
    title: "Cara daftar Food Truck Undip lebih cepat",
    seoTitle: "Daftar Food Truck Undip Lebih Cepat",
    description:
      "Helper Siap Dips buat form pendaftaran Food Truck (makanan sehat) Undip: auto scroll, auto pilih lokasi, dan refresh opsional pas slot dibuka.",
    intro:
      "Slot Food Truck biasanya cepat habis. Helper ini mengurangi langkah manual di form pendaftaran pas slot dibuka.",
    category: "kampus",
    icon: Utensils,
    minutes: 2,
    sites: ["form.undip.ac.id/makanansehat"],
    video: video("vid-foodtruk", "Video cara memakai helper Food Truck Undip"),
    steps: [
      {
        title: "Atur lokasi favorit",
        body: "Di halaman pengaturan Siap Dips, buka bagian FoodTruk dan pilih lokasi yang biasa kamu ambil.",
      },
      {
        title: "Buka form pendaftaran",
        body: "Di kartu **Food Truk**, klik **Goto Undip Food Truk**. Kartu juga menampilkan jam sekarang biar kamu tahu kapan slot dibuka.",
      },
      {
        title: "Tambahkan helper",
        body: "Di tab form, buka popup dan klik **~Add~**. Helper melakukan auto scroll dan auto pilih lokasi, plus refresh otomatis kalau kamu nyalakan.",
      },
      {
        title: "Cek lalu kirim",
        body: "Pastikan data kamu benar sebelum mengirim form.",
      },
    ],
    tips: [
      "Kalau klik **~Add~** di tab lain, Siap Dips akan bilang itu bukan halaman Food Truk.",
    ],
    related: ["dyandra-loket", "auto-pbm", "learnsocial"],
  },
  {
    slug: "dyandra-loket",
    name: "Dyandra Loket helper",
    title: "Cara pakai Dyandra Loket helper buat pantau tiket",
    seoTitle: "Dyandra Loket Helper: Pantau Link Tiket Otomatis",
    description:
      "Helper Siap Dips me-refresh halaman Dyandra, mengecek link Loket, dan otomatis membuka link kalau teks target ketemu.",
    intro:
      "Nunggu link tiket muncul sambil refresh terus itu capek. Helper ini yang refresh dan mengecek buat kamu.",
    category: "kampus",
    icon: Ticket,
    minutes: 2,
    sites: ["dyandraglobalstore-02.com"],
    steps: [
      {
        title: "Buka halaman Dyandra",
        body: "Di kartu **Dyandra Loket Helper**, klik **Buka Dyandra**.",
      },
      {
        title: "Tampilkan helper di halaman",
        body: "Nyalakan **Auto helper di page**, atau klik **Tampilin Helper** buat memunculkan panel di tab Dyandra.",
      },
      {
        title: "Cek atau refresh manual",
        body: "Klik **Cek Sekarang** buat mengecek link Loket saat itu juga, atau **Refresh Sekarang** buat memuat ulang halaman.",
      },
      {
        title: "Biarkan tab tetap terbuka",
        body: "Helper membuka link otomatis begitu teks target ketemu.",
      },
    ],
    related: ["foodtruk", "tab-suspender", "job-tracker"],
  },
  {
    slug: "tab-suspender",
    name: "Tab suspender",
    title: "Cara bikin browser lebih ringan dengan tab suspender",
    seoTitle: "Tab Suspender Siap Dips: Browser Lebih Ringan",
    description:
      "Tidurkan tab yang lama nggak dibuka biar RAM lega, dan tutup otomatis tab yang sudah lama tidur. Tab yang di-pin atau sedang bunyi dilewati.",
    intro:
      "Buka puluhan tab materi itu wajar. Tab suspender menidurkan tab yang nggak aktif biar laptop nggak ngos-ngosan.",
    category: "produktivitas",
    icon: TimerReset,
    minutes: 2,
    sites: ["Semua tab"],
    steps: [
      {
        title: "Atur waktu suspend",
        body: "Di kartu **Suspend Card**, pilih berapa lama tab boleh nganggur sebelum ditidurkan, dari **20 seconds** sampai **2 weeks**, atau **Never**.",
      },
      {
        title: "Atur auto close (opsional)",
        body: "Di bagian **Automatically close tabs**, pilih kapan tab yang sudah tidur ditutup otomatis.",
      },
      {
        title: "Suspend sekarang",
        body: "Klik **Suspend all those tabs now** atau **Close All suspended tabs now** kalau mau beres-beres sekarang juga.",
      },
      {
        title: "Lewat klik kanan",
        body: "Klik kanan di halaman mana saja dan pilih **Suspend this tab** atau **Close all suspended tabs**.",
      },
    ],
    tips: [
      "Tab yang di-pin, sedang memutar suara, atau punya isian form yang belum disimpan nggak akan ditidurkan.",
      "Tab yang tidur bisa dibuka lagi dengan satu klik.",
    ],
    related: ["job-tracker", "todoist-sync", "atur-popup"],
  },
  {
    slug: "job-tracker",
    name: "Job tracker",
    title: "Cara catat lamaran magang dan kerja dengan Job Tracker",
    seoTitle: "Job Tracker: Catat Lamaran Magang & Kerja",
    description:
      "Simpan lowongan dari LinkedIn, Indeed, Glassdoor, dan situs karier lain dengan satu klik, lalu pantau statusnya di dashboard kanban Siap Dips.",
    intro:
      "Lagi cari magang? Job Tracker menyimpan lowongan yang kamu lihat dan statusnya, jadi nggak ada lamaran yang kelupaan.",
    category: "produktivitas",
    icon: BriefcaseBusiness,
    minutes: 2,
    sites: ["LinkedIn", "Indeed", "Glassdoor", "Halaman karier perusahaan"],
    steps: [
      {
        title: "Buka lowongan",
        body: "Buka halaman lowongan di LinkedIn, Indeed, Glassdoor, atau halaman karier yang URL-nya memuat `/jobs/` atau `/careers/`. Tombol Siap Dips muncul di halaman.",
      },
      {
        title: "Simpan lowongan",
        body: "Klik tombolnya. Form **Track Job Application** muncul dengan data yang sudah terisi. Cek lalu klik **Save**.",
      },
      {
        title: "Pantau dari popup",
        body: "Kartu **Job Tracker** menampilkan tab **Saved** dan **Applied**. Klik **Add Job** buat menambah lowongan manual.",
      },
      {
        title: "Kelola di dashboard",
        body: "Klik **Open Dashboard** buat melihat semua lamaran dalam papan kanban dan memindahkan statusnya.",
      },
    ],
    related: ["tab-suspender", "todoist-sync", "atur-popup"],
  },
];

export const featuredTutorials = tutorials.filter((t) => t.featured);

export const getTutorial = (slug: string) =>
  tutorials.find((t) => t.slug === slug);

export const tutorialsByCategory = (Object.keys(tutorialCategories) as TutorialCategory[])
  .map((category) => ({
    category,
    ...tutorialCategories[category],
    items: tutorials.filter((t) => t.category === category),
  }))
  .filter((group) => group.items.length > 0);

