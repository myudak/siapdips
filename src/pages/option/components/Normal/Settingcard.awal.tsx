import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import {
  useSensors,
  useSensor,
  MouseSensor,
  DndContext,
  closestCenter,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";

import {
  Settings,
  Github,
  GripVertical,
  RotateCcw,
  Navigation,
  BarChart,
  Calendar,
  CheckSquare,
  MoreHorizontal,
  Palette,
  Quote,
  LucideProps,
} from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { CSS } from "@dnd-kit/utilities";

const cardComponents: {
  [key: string]: [string, LucideProps];
} = {
  NavigationCard: ["Navigation Card", <Navigation />],
  Ipkstatus: ["IPK Status", <BarChart />],
  Themecard: ["Theme Card", <Palette />],
  HidePopupcard: ["Lainnya", <MoreHorizontal />],
  QuoteCard: ["Quotes", <Quote />],
  TodoList: ["Todo List", <CheckSquare />],
  AutopbmCard: ["PBM Auto", <Calendar />],
};

const initialCards = Object.keys(cardComponents);
const LOCAL_STORAGE_KEY = "sortableCards";

const SettingcardAwal = () => {
  const [items, setItems] = useState<string[]>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (saved) {
      const savedArray = JSON.parse(saved);
      const isSameArray =
        savedArray.length === initialCards.length &&
        [...savedArray].sort().join() === [...initialCards].sort().join();
      if (isSameArray) return savedArray;
    }
    return initialCards;
  });

  const sensors = useSensors(useSensor(MouseSensor));

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(items));
    toast.success("Saved", {
      action: {
        label: "X",
        onClick: () => console.log("(#-_ゝ-)"),
      },
    });
  }, [items]);

  const handleDragEnd = (event: any) => {
    const { active, over } = event;

    if (active.id !== over.id) {
      setItems((prev: any[]) => {
        const oldIndex = prev.indexOf(active.id);
        const newIndex = prev.indexOf(over.id);
        return arrayMove(prev, oldIndex, newIndex);
      });
    }
  };
  return (
    <>
      {/* Main Feature Card */}
      <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
        <CardHeader>
          <CardTitle className="text-slate-900 dark:text-white">
            SiapDipss
          </CardTitle>
          <CardDescription className="dark:text-slate-400">
            (✿◡‿◡)(*^▽^*)（*＾-＾*）
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={items}
              strategy={verticalListSortingStrategy}
            >
              {items.map((id) => (
                <SortableItem
                  key={id}
                  id={id}
                  // @ts-ignore
                  Nama={cardComponents[id][0]}
                  Emot={cardComponents[id][1]}
                />
              ))}
            </SortableContext>
          </DndContext>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button
            variant="outline"
            className="dark:bg-slate-800 dark:text-white dark:hover:bg-slate-700"
          >
            <Settings className="w-4 h-4 mr-2" />
            Settings
          </Button>
          <Button variant={"destructive"}>
            {" "}
            <RotateCcw /> Reset
          </Button>
        </CardFooter>
      </Card>

      {/* Additional Features */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
          <CardHeader>
            <CardTitle className="text-slate-900 dark:text-white text-lg">
              Feature ~~&gt;
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-slate-600 dark:text-slate-300 text-base">
              <li className="flex items-center gap-2">
                - Block Pop-ups on SSO
              </li>
              <li className="flex items-center gap-2">
                - Automate PBM evaluation form
              </li>
              <li className="flex items-center gap-2">- Hide user's IPK</li>

              <li className="flex items-center gap-2">
                - Dark Mode for SSO/SIAP/Kulon
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
          <CardHeader>
            <CardTitle className="text-slate-900 dark:text-white text-lg">
              Quick Links
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Button
                variant="outline"
                className="w-full justify-start dark:bg-slate-800 dark:text-white dark:hover:bg-slate-700"
              >
                <Github className="w-4 h-4 mr-2" />
                View on GitHub
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start dark:bg-slate-800 dark:text-white dark:hover:bg-slate-700"
              >
                <Settings className="w-4 h-4 mr-2" />
                Advanced Settings
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

function SortableItem({
  id,
  Nama,
  Emot,
}: {
  id: string;
  Nama: String;
  Emot: LucideProps;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`flex items-center gap-3 p-3 rounded-lg border bg-gray-300 dark:bg-gray-700 bg-card hover:bg-accent/50 transition-colors hover:cursor-pointer ${
        isDragging ? "opacity-50" : ""
      }`}
    >
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8 cursor-grab active:cursor-grabbing"
        {...attributes}
        {...listeners}
      >
        <GripVertical className="h-4 w-4" />
      </Button>
      <span className={`flex-1 text-base flex-wrap select-none `}>{Nama}</span>
      <Button
        variant="ghost"
        size="icon"
        title="hapus todo"
        className="h-8 w-8  "
      >
        {/* @ts-ignore */}
        {Emot}
      </Button>
    </div>
  );
}

export default SettingcardAwal;
