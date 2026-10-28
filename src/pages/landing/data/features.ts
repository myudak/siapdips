import {
  BookOpenCheck,
  BriefcaseBusiness,
  CalendarDays,
  CheckSquare,
  ClipboardCheck,
  Compass,
  GraduationCap,
  KanbanSquare,
  ListChecks,
  MessageSquare,
  MoonStar,
  MousePointerClick,
  QrCode,
  Quote,
  Sparkles,
  Ticket,
  TimerReset,
  UserRound,
  Utensils,
  type LucideIcon,
} from "lucide-react";
import type { TutorialCategory } from "./tutorials";

export type DirectoryCategory = Exclude<TutorialCategory, "mulai">;

export const directoryFilters: { id: DirectoryCategory; label: string }[] = [
  { id: "akademik", label: "SIAP & akademik" },
  { id: "kulon", label: "Kulon & belajar" },
  { id: "kampus", label: "Kampus & event" },
  { id: "produktivitas", label: "Produktivitas" },
];

export type DirectoryFeature = {
  name: string;
  description: string;
  category: DirectoryCategory;
  icon: LucideIcon;
  where: string;
  tutorial?: string;
};

export const directoryFeatures: DirectoryFeature[] = [
  {
    name: "Jadwal Dips",
    description: "Matkul hari ini, kemarin, dan besok di popup, plus link MS Teams.",
    category: "akademik",
    icon: CalendarDays,
    where: "SIAP",
    tutorial: "jadwal",
  },
  {
    name: "IPK Status",
    description: "Lihat IPK cepat, blur, atau ganti teksnya pas screen share.",
    category: "akademik",
    icon: GraduationCap,
    where: "SIAP",
    tutorial: "ipk",
  },
  {
    name: "Auto PBM",
    description: "Isi evaluasi PBM pakai template jawaban kamu sendiri.",
    category: "akademik",
    icon: ClipboardCheck,
    where: "SIAP",
    tutorial: "auto-pbm",
  },
  {
    name: "QR Code Reader",
    description: "Absen dari foto atau screenshot QR kalau kamera bermasalah.",
    category: "akademik",
    icon: QrCode,
    where: "SIAP",
    tutorial: "qr-absen",
  },
  {
    name: "Tema & dark mode",
    description: "Dark mode atau warna sendiri di SIAP, SSO, dan Kulon.",
    category: "akademik",
    icon: MoonStar,
    where: "SIAP · SSO · Kulon",
    tutorial: "tema-dark-mode",
  },
  {
    name: "Klik kanan & popup SSO",
    description: "Balikin klik kanan dan copy, tutup popup SSO, blur dosen wali.",
    category: "akademik",
    icon: MousePointerClick,
    where: "SSO · SIAP",
    tutorial: "klik-kanan",
  },
  {
    name: "Profil di popup",
    description: "Nama, NIM, dan prodi dari SIAP. Salin cepat atau blur.",
    category: "akademik",
    icon: UserRound,
    where: "Popup",
  },
  {
    name: "Moodle helper & Tany AI",
    description: "Google Soal, Copy Soal, dan Tany AI (Alt+A) di halaman quiz Kulon.",
    category: "kulon",
    icon: Sparkles,
    where: "Kulon",
    tutorial: "moodle-helper",
  },
  {
    name: "AI Chat",
    description: "Chat dengan AI langsung dari popup, pakai API key kamu sendiri.",
    category: "kulon",
    icon: MessageSquare,
    where: "Popup",
    tutorial: "moodle-helper",
  },
  {
    name: "Todoist Sync",
    description: "Kirim tugas dan deadline dari dashboard Kulon ke Todoist.",
    category: "kulon",
    icon: ListChecks,
    where: "Kulon · Todoist",
    tutorial: "todoist-sync",
  },
  {
    name: "Auto Learn Social",
    description: "Helper di halaman LearnSocial buat materi dan tugas harian.",
    category: "kulon",
    icon: BookOpenCheck,
    where: "LearnSocial",
    tutorial: "learnsocial",
  },
  {
    name: "Quick Access",
    description: "Pintasan ke SSO, SIAP, Absensi, Kulon, HALO, dan LearnSocial.",
    category: "kampus",
    icon: Compass,
    where: "Popup",
    tutorial: "atur-popup",
  },
  {
    name: "FoodTruk helper",
    description: "Auto scroll, auto lokasi, dan refresh di form Food Truck.",
    category: "kampus",
    icon: Utensils,
    where: "form.undip.ac.id",
    tutorial: "foodtruk",
  },
  {
    name: "Dyandra Loket helper",
    description: "Refresh dan cek link tiket otomatis, buka begitu muncul.",
    category: "kampus",
    icon: Ticket,
    where: "Dyandra",
    tutorial: "dyandra-loket",
  },
  {
    name: "Tab suspender",
    description: "Tidurkan tab yang nganggur biar RAM lega.",
    category: "produktivitas",
    icon: TimerReset,
    where: "Semua tab",
    tutorial: "tab-suspender",
  },
  {
    name: "Job Tracker",
    description: "Simpan lowongan magang dan kerja, pantau di papan kanban.",
    category: "produktivitas",
    icon: BriefcaseBusiness,
    where: "LinkedIn · Indeed · dll",
    tutorial: "job-tracker",
  },
  {
    name: "Todo list",
    description: "To-do cepat di popup, tersimpan di browser.",
    category: "produktivitas",
    icon: CheckSquare,
    where: "Popup",
  },
  {
    name: "Todo board",
    description: "Papan kanban to-do dengan kolom sendiri di halaman pengaturan.",
    category: "produktivitas",
    icon: KanbanSquare,
    where: "Pengaturan",
  },
  {
    name: "Quotes",
    description: "Kutipan random biar popup nggak cuma urusan tugas.",
    category: "produktivitas",
    icon: Quote,
    where: "Popup",
  },
];
