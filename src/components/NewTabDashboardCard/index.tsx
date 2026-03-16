import { useEffect, useState } from "react";
import { DraggableAttributes } from "@dnd-kit/core";
import { SyntheticListenerMap } from "@dnd-kit/core/dist/hooks/utilities";
import {
  ExternalLink,
  GripHorizontal,
  LayoutDashboard,
  SettingsIcon,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import HideButton from "../hideButton";
import { toast } from "sonner";
import { STORAGE_KEY_NEW_TAB_DASHBOARD_ENABLED } from "@/lib/kulon/shared";

const NewTabDashboardCard = ({
  listeners,
  attributes,
  id,
}: {
  listeners?: DraggableAttributes;
  attributes?: SyntheticListenerMap;
  id?: string;
}) => {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    void syncState();

    const handleChange = (
      changes: { [key: string]: chrome.storage.StorageChange },
      areaName: string
    ) => {
      if (
        areaName === "local" &&
        STORAGE_KEY_NEW_TAB_DASHBOARD_ENABLED in changes
      ) {
        setEnabled(Boolean(changes[STORAGE_KEY_NEW_TAB_DASHBOARD_ENABLED]?.newValue));
      }
    };

    chrome.storage.onChanged.addListener(handleChange);
    return () => chrome.storage.onChanged.removeListener(handleChange);
  }, []);

  const syncState = async () => {
    const result = await chrome.storage.local.get([
      STORAGE_KEY_NEW_TAB_DASHBOARD_ENABLED,
    ]);
    setEnabled(Boolean(result[STORAGE_KEY_NEW_TAB_DASHBOARD_ENABLED]));
  };

  const openNewTabDashboard = async () => {
    try {
      await chrome.tabs.create({});
    } catch (error) {
      console.error("Failed to open new tab dashboard:", error);
      toast.error("Failed to open new tab dashboard.");
    }
  };

  return (
    <Card className="relative group w-full dark:bg-gray-800 dark:border-gray-700">
      <HideButton
        id={id || "NewTabDashboardCard"}
        classNames="group-hover:flex hidden transition-all duration-300"
      />
      <Button
        variant="ghost"
        size="icon"
        className="w-full h-8 rounded-b-none border border-b-0 dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700"
        {...attributes}
        {...listeners}
      >
        <GripHorizontal className="h-4 w-4" />
      </Button>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between gap-3 text-lg font-bold">
          <span className="flex items-center gap-2">
            <LayoutDashboard className="h-5 w-5" />
            New Tab Dashboard
          </span>
          <Badge variant={enabled ? "default" : "secondary"}>
            {enabled ? "Enabled" : "Disabled"}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <p className="text-sm text-muted-foreground">
          Minimal Kulon assignments plus your local todo list on every new tab.
        </p>
        <Button className="w-full" onClick={() => void openNewTabDashboard()}>
          <ExternalLink className="mr-2 h-4 w-4" />
          Open New Tab
        </Button>
        <Button
          variant="secondary"
          className="w-full"
          onClick={() => {
            chrome.tabs.create({
              url: chrome.runtime.getURL("option.html#newTabDashboard"),
            });
          }}
        >
          <SettingsIcon className="mr-2 h-4 w-4" />
          Configure Dashboard
        </Button>
      </CardContent>
    </Card>
  );
};

export default NewTabDashboardCard;
