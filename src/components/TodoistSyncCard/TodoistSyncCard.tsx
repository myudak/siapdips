import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { DraggableAttributes } from "@dnd-kit/core";
import { SyntheticListenerMap } from "@dnd-kit/core/dist/hooks/utilities";
import {
  RefreshCw,
  GripHorizontal,
  SettingsIcon,
  Link2,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { Button } from "../ui/button";
import { getActiveTab } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import { useEffect, useState } from "react";
import HideButton from "../hideButton";
import { toast } from "sonner";

const STORAGE_KEY_API_TOKEN = "todoistApiToken";
const STORAGE_KEY_PROJECT_ID = "todoistProjectId";

const TodoistSyncCard = ({
  listeners,
  attributes,
  id,
}: {
  listeners?: DraggableAttributes;
  attributes?: SyntheticListenerMap;
  id?: string;
}) => {
  const [isConfigured, setIsConfigured] = useState<boolean>(false);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);

  useEffect(() => {
    checkConfiguration();
  }, []);

  const checkConfiguration = async () => {
    const config = await chrome.storage.local.get([
      STORAGE_KEY_API_TOKEN,
      STORAGE_KEY_PROJECT_ID,
    ]);
    const configured = !!(config[STORAGE_KEY_API_TOKEN] && config[STORAGE_KEY_PROJECT_ID]);
    setIsConfigured(configured);
  };

  const handleSyncNow = async () => {
    if (!isConfigured) {
      toast.error("Please configure Todoist settings first");
      return;
    }

    setIsSyncing(true);
    try {
      const tabId = await getActiveTab();
      const currentTab = await chrome.tabs.get(tabId);

      if (!currentTab.url?.includes("kulon2.undip.ac.id/my/")) {
        toast.error("Please navigate to Kulon2 assignments page first");
        setIsSyncing(false);
        return;
      }

      // Trigger the sync by sending a message to the background script
      chrome.tabs.reload(tabId);
      toast.success("Syncing... Check the page for status");
    } catch (error) {
      console.error("Sync error:", error);
      toast.error("Failed to sync. Please try again.");
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <>
      <Card className="w-full dark:bg-gray-800 dark:border-gray-700 relative group">
        <HideButton
          id={id || "TodoistSyncCard"}
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
        <CardHeader className="py-2">
          <CardTitle className="text-lg font-bold flex items-center justify-between">
            <span>Todoist Sync</span>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  {isConfigured ? (
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                  ) : (
                    <AlertCircle className="h-4 w-4 text-yellow-500" />
                  )}
                </TooltipTrigger>
                <TooltipContent>
                  {isConfigured
                    ? "Todoist is configured"
                    : "Todoist not configured"}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-1 flex flex-col">
          <Button
            className="w-full"
            onClick={handleSyncNow}
            disabled={!isConfigured || isSyncing}
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${isSyncing ? "animate-spin" : ""}`} />
            {isSyncing ? "Syncing..." : "Sync Now"}
          </Button>
          <Button
            variant={"secondary"}
            className="w-full"
            onClick={() => {
              chrome.tabs.create({
                url: chrome.runtime.getURL("option.html#todoistSettings"),
              });
            }}
          >
            <SettingsIcon className="w-4 h-4 mr-2" />
            Configure Todoist
          </Button>
          <Button
            variant={"secondary"}
            className="w-full"
            onClick={() =>
              chrome.tabs.create({
                url: "https://kulon2.undip.ac.id/my/",
              })
            }
          >
            <Link2 className="w-4 h-4 mr-2" />
            Goto Kulon2 ~&gt;
          </Button>
        </CardContent>
      </Card>
    </>
  );
};

export default TodoistSyncCard;
