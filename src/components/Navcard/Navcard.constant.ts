// --- Type & Icon Setup ---

import {
  LucideIcon,
  KeyRound,
  GraduationCap,
  ScanLine,
  MonitorPlay,
  Headphones,
  SquareTerminal,
} from "lucide-react";

// Define allowed icon names as a union type.
type IconName =
  | "KeyRound"
  | "GraduationCap"
  | "ScanLine"
  | "MonitorPlay"
  | "Headphones"
  | "SquareTerminal";

// Map icon names to their corresponding Lucide React components.
const ICON_MAP: Record<IconName, LucideIcon> = {
  KeyRound,
  GraduationCap,
  ScanLine,
  MonitorPlay,
  Headphones,
  SquareTerminal,
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
    title: "Learn Social",
    icon: SquareTerminal,
    subtitle: "Basing",
    tooltip: "Basing",
    href: "https://undip.learnsocial.online",
  },
];

const EXCLUDED_AWAL: DraggableButton[] = [
  {
    id: "7",
    title: "SSO",
    icon: KeyRound,
    subtitle: "SSO UNDIP",
    tooltip:
      "SSO adalah sistem terintegrasi yang menghubungkan seluruh civitas akademika Undip.",
    href: "https://sso.undip.ac.id/pages/dashboard",
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
