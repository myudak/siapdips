import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import NavButton from "./Navcard.button";
import { navLinks } from "./Navcard.constant";
import { DraggableAttributes } from "@dnd-kit/core";
import { SyntheticListenerMap } from "@dnd-kit/core/dist/hooks/utilities";
import {
  GraduationCap,
  GripHorizontal,
  Headphones,
  KeyRound,
  LucideIcon,
  MonitorPlay,
  ScanLine,
  SquareTerminal,
} from "lucide-react";
import { Button } from "../ui/button";
import { useEffect, useState } from "react";

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

interface DraggableButton {
  id: string;
  title: string;
  icon: React.ElementType;
  subtitle: string;
  tooltip: string;
  href: string;
}

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

// Serializable version for storage (replace icon with its name)
interface DraggableButtonSerialized extends Omit<DraggableButton, "icon"> {
  iconName: IconName;
}

const INCLUDED_AWAL_SERIALIZABLE: DraggableButtonSerialized[] =
  INCLUDED_AWAL.map(({ icon, ...rest }) => ({
    ...rest,
    iconName: getIconName(icon),
  }));

const NavigationCard = ({
  listeners,
  attributes,
}: {
  listeners?: DraggableAttributes;
  attributes?: SyntheticListenerMap;
}) => {
  const [linkNav, setLinkNav] = useState<DraggableButton[] | "">("");

  useEffect(() => {
    chrome.storage.local.get(
      ["includedNavCard", "excludedNavCard"],
      (result: {
        includedNavCard?: DraggableButtonSerialized[];
        excludedNavCard?: DraggableButtonSerialized[];
      }) => {
        if (result.includedNavCard) {
          setLinkNav(
            result.includedNavCard.map(({ iconName, ...rest }) => ({
              ...rest,
              icon: ICON_MAP[iconName],
            }))
          );
        } else {
          setLinkNav(INCLUDED_AWAL);
          chrome.storage.local.set({
            includedNavCard: INCLUDED_AWAL_SERIALIZABLE,
          });
        }
      }
    );
  }, []);
  return (
    <Card className="w-full dark:bg-gray-800 dark:border-gray-700">
      <Button
        variant="ghost"
        size="icon"
        className="w-full h-8 rounded-b-none border border-b-0 dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700"
        {...attributes}
        {...listeners}
      >
        <GripHorizontal className="h-4 w-4" />
      </Button>
      <CardHeader className="py-2">
        <CardTitle className="text-lg font-bold">Quick Access</CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-3 gap-1 p-2">
        {linkNav !== "" &&
          linkNav.map((link, index) => <NavButton key={index} {...link} />)}
      </CardContent>
    </Card>
  );
};

export default NavigationCard;
