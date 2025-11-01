import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { EyeIcon, Info } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { LOCAL_STORAGE_SORTABLE_HIDE_KEY } from "@/constants/storage";

const HideButton = ({
  id,
  classNames,
}: {
  id: string;
  classNames?: string;
}) => {
  const [itemsHide, setItemsHide] = useState<string[]>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_SORTABLE_HIDE_KEY);
    if (saved) {
      return JSON.parse(saved);
    }
    return [];
  });

  useEffect(() => {
    const handleItemsHideChange = (
      event: CustomEvent<{ itemsHide: string[] }>
    ) => {
      setItemsHide(event.detail.itemsHide);
    };

    window.addEventListener(
      "itemsHideChanged",
      handleItemsHideChange as EventListener
    );

    return () => {
      window.removeEventListener(
        "itemsHideChanged",
        handleItemsHideChange as EventListener
      );
    };
  }, []);

  useEffect(() => {
    localStorage.setItem(
      LOCAL_STORAGE_SORTABLE_HIDE_KEY,
      JSON.stringify(itemsHide)
    );
  }, [itemsHide]); // run this every time itemsHide changes

  return (
    <Button
      title="Hide Card"
      variant="ghost"
      size="icon"
      className={cn("absolute right-2 top-2 z-10", classNames)}
      onClick={() => {
        const dispatchHiddenChange = (
          updater: (prev: string[]) => string[]
        ) => {
          const current = (() => {
            try {
              const stored = localStorage.getItem(
                LOCAL_STORAGE_SORTABLE_HIDE_KEY
              );
              return stored ? JSON.parse(stored) : [];
            } catch {
              return [];
            }
          })();

          setItemsHide(() => {
            const next = updater(current);
            window.dispatchEvent(
              new CustomEvent("itemsHideChanged", {
                detail: { itemsHide: next },
              })
            );
            return next;
          });
        };

        const handleUndoHide = () => {
          toast.info(`Unhide ${id}`, {
            closeButton: true,
          });
          dispatchHiddenChange((prev) => prev.filter((item) => item !== id));
        };

        ShowHiddenToast(id, handleUndoHide);
        dispatchHiddenChange((prev) =>
          prev.includes(id) ? prev : [...prev, id]
        );
      }}
    >
      <EyeIcon className="h-4 w-4" />
    </Button>
  );
};

function ShowHiddenToast(id: string, handleUndoHide: () => void) {
  const t = toast(
    <div className="flex justify-around items-center gap-3 w-full">
      <Info className="size-4" />
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium">Card hidden</p>
        <p className="text-xs text-muted-foreground truncate">
          Hidden <span className="font-medium">#{id}</span>.
        </p>
      </div>

      <div className="flex items-center gap-1">
        <Button
          size="sm"
          onClick={() => {
            handleUndoHide();
            toast.dismiss(t);
          }}
        >
          Undo
        </Button>

        <Button
          onClick={() => chrome.tabs.create({ url: "option.html#sect1" })}
          size="sm"
          variant="ghost"
        >
          Info
        </Button>
      </div>
    </div>,
    {
      icon: <Info className="size-4" />,
      duration: 6000,
    }
  );
}

export default HideButton;
