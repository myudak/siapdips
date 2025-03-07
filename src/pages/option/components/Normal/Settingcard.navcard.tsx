import { useEffect, useState } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  defaultDropAnimationSideEffects,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  GraduationCap,
  GripHorizontal,
  Headphones,
  KeyRound,
  MonitorPlay,
  ScanLine,
  SquareTerminal,
  LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

// --- Type & Icon Setup ---

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

// --- Default Data ---

const MAX_INCLUDED_ITEMS = 6;

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

// --- UI Components ---

interface SortableButtonProps {
  button: DraggableButton;
  disabled?: boolean;
}

const SortableButton: React.FC<SortableButtonProps> = ({
  button,
  disabled = false,
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: button.id, disabled });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  // Render the icon by capitalizing the variable name.
  const Icon = button.icon;

  return (
    <Button
      variant="outline"
      ref={setNodeRef}
      style={style}
      className={cn(
        "w-full flex flex-col items-center p-4 h-auto hover:bg-gray-100 dark:hover:bg-gray-600 space-y-1 gap-2 touch-none transition-all duration-200",
        isDragging && "opacity-50 scale-105",
        disabled && "opacity-50 cursor-not-allowed"
      )}
      {...attributes}
      {...listeners}
    >
      <GripHorizontal className="h-4 w-4" />
      <Icon className="h-6 w-6 mb-1" />
      <div className="text-sm font-medium">{button.title}</div>
      <div className="text-xs text-gray-500 dark:text-gray-400 w-full">
        {button.subtitle}
      </div>
    </Button>
  );
};

interface DraggableButtonOverlayProps {
  button: DraggableButton;
}

const DraggableButtonOverlay: React.FC<DraggableButtonOverlayProps> = ({
  button,
}) => {
  const Icon = button.icon;
  return (
    <Button
      variant="outline"
      className="flex items-center gap-2 touch-none shadow-lg scale-105"
    >
      <Icon className="h-6 w-6 mb-1" />
      {button.title}
    </Button>
  );
};

// --- Main Component ---

function NavCardSetting() {
  const [includedButtons, setIncludedButtons] = useState<DraggableButton[]>([]);
  const [excludedButtons, setExcludedButtons] = useState<DraggableButton[]>([]);
  const [activeButton, setActiveButton] = useState<DraggableButton | null>(
    null
  );

  // On mount, load data from chrome.storage.local (or initialize with defaults).
  useEffect(() => {
    chrome.storage.local.get(
      ["includedNavCard", "excludedNavCard"],
      (result: {
        includedNavCard?: DraggableButtonSerialized[];
        excludedNavCard?: DraggableButtonSerialized[];
      }) => {
        if (result.includedNavCard) {
          setIncludedButtons(
            result.includedNavCard.map(({ iconName, ...rest }) => ({
              ...rest,
              icon: ICON_MAP[iconName],
            }))
          );
        }
        if (result.excludedNavCard) {
          setExcludedButtons(
            result.excludedNavCard.map(({ iconName, ...rest }) => ({
              ...rest,
              icon: ICON_MAP[iconName],
            }))
          );
        }
        if (!result.includedNavCard && !result.excludedNavCard) {
          chrome.storage.local.set({
            includedNavCard: INCLUDED_AWAL_SERIALIZABLE,
            excludedNavCard: EXCLUDED_AWAL_SERIALIZABLE,
          });
          setIncludedButtons(INCLUDED_AWAL);
          setExcludedButtons(EXCLUDED_AWAL);
        }
      }
    );
  }, []);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const allButtons = [...includedButtons, ...excludedButtons];
    const activeButton = allButtons.find((button) => button.id === active.id);
    if (activeButton) setActiveButton(activeButton);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveButton(null);
    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    let newIncludedButtons = includedButtons;
    let newExcludedButtons = excludedButtons;

    const isFromIncluded = includedButtons.some((b) => b.id === activeId);
    const isFromExcluded = excludedButtons.some((b) => b.id === activeId);
    const isToIncluded = includedButtons.some((b) => b.id === overId);
    const isToExcluded = excludedButtons.some((b) => b.id === overId);

    if (isFromIncluded && isToExcluded) {
      // Moving from included to excluded.
      const button = includedButtons.find((b) => b.id === activeId)!;
      newIncludedButtons = includedButtons.filter((b) => b.id !== activeId);
      newExcludedButtons = [...excludedButtons, button];
      setIncludedButtons(newIncludedButtons);
      setExcludedButtons(newExcludedButtons);
    } else if (
      isFromExcluded &&
      isToIncluded &&
      includedButtons.length < MAX_INCLUDED_ITEMS
    ) {
      // Moving from excluded to included (if under max limit).
      const button = excludedButtons.find((b) => b.id === activeId)!;
      newExcludedButtons = excludedButtons.filter((b) => b.id !== activeId);
      newIncludedButtons = [...includedButtons, button];
      setIncludedButtons(newIncludedButtons);
      setExcludedButtons(newExcludedButtons);
    } else if (isFromIncluded && isToIncluded) {
      // Reordering within included.
      const oldIndex = includedButtons.findIndex((b) => b.id === activeId);
      const newIndex = includedButtons.findIndex((b) => b.id === overId);
      newIncludedButtons = arrayMove(includedButtons, oldIndex, newIndex);
      setIncludedButtons(newIncludedButtons);
    } else if (isFromExcluded && isToExcluded) {
      // Reordering within excluded.
      const oldIndex = excludedButtons.findIndex((b) => b.id === activeId);
      const newIndex = excludedButtons.findIndex((b) => b.id === overId);
      newExcludedButtons = arrayMove(excludedButtons, oldIndex, newIndex);
      setExcludedButtons(newExcludedButtons);
    }

    // Serialize and save updated state to chrome.storage.local.
    const includedNavCardSerialized: DraggableButtonSerialized[] =
      newIncludedButtons.map(({ icon, ...rest }) => ({
        ...rest,
        iconName: getIconName(icon),
      }));
    const excludedNavCardSerialized: DraggableButtonSerialized[] =
      newExcludedButtons.map(({ icon, ...rest }) => ({
        ...rest,
        iconName: getIconName(icon),
      }));

    chrome.storage.local.set({
      includedNavCard: includedNavCardSerialized,
      excludedNavCard: excludedNavCardSerialized,
    });

    toast.success("Saved");
  };

  const dropAnimation = {
    sideEffects: defaultDropAnimationSideEffects({
      styles: { active: { opacity: "0.5" } },
    }),
  };

  return (
    <div className="container mx-auto p-8">
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <Card className="p-6 bg-gradient-to-b from-background to-muted/20">
          <div className="space-y-8">
            <div>
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                Quick Access
                <span className="text-sm font-normal text-muted-foreground">
                  ({includedButtons.length}/{MAX_INCLUDED_ITEMS} max)
                </span>
              </h2>
              <SortableContext items={includedButtons.map((b) => b.id)}>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {includedButtons.map((button) => (
                    <SortableButton key={button.id} button={button} />
                  ))}
                </div>
              </SortableContext>
            </div>
            <div className="border-t pt-8">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                Excluded Items
                <span className="text-sm font-normal text-muted-foreground">
                  {includedButtons.length >= MAX_INCLUDED_ITEMS &&
                    "(Included items at max capacity)"}
                </span>
              </h2>
              <SortableContext items={excludedButtons.map((b) => b.id)}>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {excludedButtons.map((button) => (
                    <SortableButton
                      key={button.id}
                      button={button}
                      disabled={includedButtons.length >= MAX_INCLUDED_ITEMS}
                    />
                  ))}
                </div>
              </SortableContext>
            </div>
          </div>
        </Card>
        <DragOverlay dropAnimation={dropAnimation}>
          {activeButton && <DraggableButtonOverlay button={activeButton} />}
        </DragOverlay>
      </DndContext>
    </div>
  );
}

export default NavCardSetting;
