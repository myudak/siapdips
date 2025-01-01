import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { HelpCircle } from "lucide-react";
import { useEffect, useState } from "react";

const HidePopupcard = () => {
  const [hidePopup, setHidePopup] = useState(false);

  useEffect(() => {
    const getHidePopup = async () => {
      const hidePopup = await chrome.storage.local.get("hidePopup");
      if (hidePopup.hidePopup === undefined) return;
      setHidePopup(hidePopup.hidePopup);
    };
    getHidePopup();
  }, []);

  const onclick = async () => {
    chrome.storage.local.set({ hidePopup: !hidePopup });
    let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (
      !hidePopup ||
      !tab.url?.includes("https://sso.undip.ac.id/pages/dashboard")
    )
      return;
    chrome.scripting.executeScript({
      target: { tabId: tab.id! },
      func: () => {
        console.log("HIDE POPP UP");
        const popupElement = document.querySelector(
          ".swal2-container"
        ) as HTMLElement;
        if (popupElement) {
          popupElement.style.display = "none";
          document.body.style.overflow = "auto"; // Fix scrolling issue
        }
      },
    });
  };

  return (
    <Card className="w-full dark:bg-gray-800 dark:border-gray-700 ">
      <CardContent className="flex items-center m-4 p-0">
        <Switch
          checked={hidePopup}
          onCheckedChange={() => {
            onclick();
            setHidePopup(!hidePopup);
          }}
          id="hide-popup"
        />
        <Label
          htmlFor="hide-popup"
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 ml-2"
        >
          Hide pop up SSO
        </Label>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <HelpCircle className="h-4 w-4 text-muted-foreground cursor-help ml-2" />
            </TooltipTrigger>
            <TooltipContent>
              berlaku di https://sso.undip.ac.id/pages/dashboard
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </CardContent>
    </Card>
  );
};

export default HidePopupcard;
