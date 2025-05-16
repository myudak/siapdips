// --- Type & Icon Setup ---

import {
  LucideIcon,
  KeyRound,
  GraduationCap,
  ScanLine,
  MonitorPlay,
  Headphones,
  SquareTerminal,
  FilePenIcon,
  MailIcon,
  School2Icon,
  NewspaperIcon,
} from "lucide-react";

// Define allowed icon names as a union type.
type IconName =
  | "KeyRound"
  | "GraduationCap"
  | "ScanLine"
  | "MonitorPlay"
  | "Headphones"
  | "SquareTerminal"
  | "FilePenIcon"
  | "MailIcon"
  | "NewspaperIcon"
  | "School2Icon";

// Map icon names to their corresponding Lucide React components.
const ICON_MAP: Record<IconName, LucideIcon> = {
  KeyRound,
  GraduationCap,
  ScanLine,
  MonitorPlay,
  Headphones,
  SquareTerminal,
  FilePenIcon,
  MailIcon,
  School2Icon,
  NewspaperIcon,
};

// Helper to retrieve the icon name from a component.
function getIconName(icon: React.ElementType): IconName {
  const keys = Object.keys(ICON_MAP) as IconName[];
  const found = keys.find((key) => ICON_MAP[key] === icon);
  if (!found) {
    throw new Error("Icon not found in ICON_MAP");
  }
  return found;
}

// --- Draggable Button Interfaces ---

interface DraggableButton {
  id: string;
  title: string;
  icon: React.ElementType;
  subtitle: string;
  tooltip: string;
  href: string;
}

// Serializable version for storage (replace icon with its name)
interface DraggableButtonSerialized extends Omit<DraggableButton, "icon"> {
  iconName: IconName;
}

const INCLUDED_AWAL: DraggableButton[] = [
  {
    id: "1",
    title: "SSO",
    icon: KeyRound,
    subtitle: "SSO UNDIP",
    tooltip:
      "SSO adalah sistem terintegrasi yang menghubungkan seluruh civitas akademika Undip.",
    href: "https://sso.undip.ac.id/pages/dashboard",
  },
  {
    id: "2",
    title: "SIAP",
    icon: GraduationCap,
    subtitle: "SIAP UNDIP",
    tooltip:
      "Sistem informasi akademik Universitas Diponegoro untuk mahasiswa.",
    href: "https://siap.undip.ac.id/sso/login",
  },
  {
    id: "3",
    title: "ABSENSI",
    icon: ScanLine,
    subtitle: "Absensi Scanner",
    tooltip: "Scanner Absensi - SIAP Undip",
    href: "https://siap.undip.ac.id/master_perkuliahan/mhs/absensi/scanner",
  },
  {
    id: "4",
    title: "KULON",
    icon: MonitorPlay,
    subtitle: "Kuliah Online",
    tooltip: "Kulon Undip Moodle",
    href: "https://kulon2.undip.ac.id/auth/oidc/",
  },
  {
    id: "5",
    title: "HALO",
    icon: Headphones,
    subtitle: "HALO UNDIP",
    tooltip: "Helpdesk etc",
    href: "https://halo.undip.ac.id/",
  },
  {
    id: "6",
    title: "LEARN SOCIAL",
    icon: SquareTerminal,
    subtitle: "Basing",
    tooltip: "Basing",
    href: "https://undip.learnsocial.online",
  },
];

const EXCLUDED_AWAL: DraggableButton[] = [
  {
    id: "7",
    title: "FORM",
    icon: FilePenIcon,
    subtitle: "Form Undip",
    tooltip: "SSO UNDIP Form, {e-votes, news, food truk, etc}",
    href: "https://form.undip.ac.id/sso/auth",
  },
  {
    id: "8",
    title: "E-MAIL",
    icon: MailIcon,
    subtitle: "EMAIL UNDIP",
    tooltip: "UNDIP OFFICIAL EMAIL",
    href: "https://outlook.office.com",
  },
  {
    id: "9",
    title: "BEASISWA",
    icon: School2Icon,
    subtitle: "Beasiswa Dips",
    tooltip: "SCHOLARSHIP UNDIP",
    href: "https://beasiswa.undip.ac.id/sso/auth",
  },
  {
    id: "10",
    title: "DRIVE",
    icon: School2Icon,
    subtitle: "Onedrive Undip",
    tooltip: "Penyimpanan Online OneDrive",
    href: "https://undipmail-my.sharepoint.com/_layouts/15/MySite.aspx?MySiteRedirect=AllDocuments",
  },
  {
    id: "11",
    title: "NEWS",
    icon: NewspaperIcon,
    subtitle: "Hot news",
    tooltip: "NEWS PAGE",
    href: "https://sso.undip.ac.id/news/page",
  },
];

// Create serializable versions by replacing the icon with its name.
const INCLUDED_AWAL_SERIALIZABLE: DraggableButtonSerialized[] =
  INCLUDED_AWAL.map(({ icon, ...rest }) => ({
    ...rest,
    iconName: getIconName(icon),
  }));
const EXCLUDED_AWAL_SERIALIZABLE: DraggableButtonSerialized[] =
  EXCLUDED_AWAL.map(({ icon, ...rest }) => ({
    ...rest,
    iconName: getIconName(icon),
  }));

export {
  INCLUDED_AWAL,
  EXCLUDED_AWAL,
  INCLUDED_AWAL_SERIALIZABLE,
  EXCLUDED_AWAL_SERIALIZABLE,
  getIconName,
  ICON_MAP,
};

export type { DraggableButton, DraggableButtonSerialized };

[
  "https://sso.undip.id/sso/auth",
  "https://sso.undip.ac.id/news/page",
  "https://form.undip.ac.id/sso/auth?redirect=bmV3cy93ZWVrbHk%3D",
  "https://www.undip.ac.id/newsletter",
  "https://www.undip.ac.id/buku-annual-report-undip",
  "https://radioonline.co.id/pro-alma",
  "https://play.google.com/store/apps/dev?id=8488992061002379339&hl=id",
  "https://outlook.office.com",
  "https://www.office.com/?auth=2",
  "https://undipmail-my.sharepoint.com/_layouts/15/MySite.aspx?MySiteRedirect=AllDocuments",
  'https://teams.microsoft.com/l/entity/fe4a8eba-2a31-4737-8e33-e5fae6fee194/tasklist123?webUrl=https://sso.undip.ac.id/999&label=Task List 999&context={"channelId": "19:cbe3683f25094106b826c9cada3afbe0@thread.skype"}',
  "https://siap.undip.ac.id/sso/login",
  "https://kulon2.undip.ac.id/auth/oidc/",
  null,
  "https://ejournal.undip.ac.id/",
  "https://lib.undip.ac.id/index.php?p=member",
  "https://accessmedicine.mhmedical.com/",
  "https://halo.undip.ac.id/",
  "https://pendaftaranblog.undip.ac.id/",
  "https://form.undip.ac.id/sso/auth",
  "https://pkm.apps.undip.ac.id/sso/login",
  "https://event.bak.undip.ac.id/sso/login",
  "https://beasiswa.undip.ac.id/sso/auth",
  "https://form.undip.ac.id/sso/auth?redirect=dm90ZWJlbS92b3Rpbmcvc3RhcnQ%3D",
  "https://siasat.apps.undip.ac.id/sso/auth",
];
