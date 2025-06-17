import { DraggableAttributes } from "@dnd-kit/core";
import { SyntheticListenerMap } from "@dnd-kit/core/dist/hooks/utilities";
import { GripHorizontal, HelpCircle, SettingsIcon } from "lucide-react";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import { Switch } from "../ui/switch";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import { Label } from "../ui/label";
import { useEffect, useState } from "react";
export default function MoodleCard({
  listeners,
  attributes,
}: {
  listeners?: DraggableAttributes;
  attributes?: SyntheticListenerMap;
}) {
  const [stateGoogleSoal, setStateGoogleSoal] = useState(true);
  const [stateCopySoal, setStateCopySoal] = useState(true);
  const [stateTanyAI, setStateTanyAI] = useState(true);
  const [stateHelper, setStateHelper] = useState(false);

  useEffect(() => {
    // Load saved settings from local storage
    chrome.storage.local.get(
      ["googleSoal", "copySoal", "askAi", "moodleHelper"],
      (result) => {
        if (
          result.googleSoal === undefined ||
          result.copySoal === undefined ||
          result.askAi === undefined ||
          result.moodleHelper === undefined
        ) {
          // If settings are not found, set default values
          chrome.storage.local.set({
            googleSoal: true,
            copySoal: true,
            askAi: true,
            moodleHelper: false,
          });
        }
        setStateGoogleSoal(result.googleSoal);
        setStateCopySoal(result.copySoal);
        setStateTanyAI(result.askAi);
        setStateHelper(result.moodleHelper);
      }
    );
  }, []);

  return (
    <Card className="w-full dark:bg-gray-800 dark:border-gray-700 ">
      <Button
        variant="ghost"
        size="icon"
        className="w-full h-8 rounded-b-none border border-b-0 dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700"
        {...attributes}
        {...listeners}
      >
        <GripHorizontal className="h-4 w-4" />
      </Button>
      <CardContent className="flex flex-col  p-0">
        <div className="p-4">
          <h2 className="text-lg font-bold mb-2">Moodle Helper Settings</h2>
          <div className="flex items-center m-4 p-0">
            <Switch
              checked={stateGoogleSoal}
              onCheckedChange={() => {
                setStateGoogleSoal(!stateGoogleSoal);
                chrome.storage.local.set({ googleSoal: !stateGoogleSoal });
              }}
              id="hide-popup"
            />
            <Label
              htmlFor="hide-popup"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 ml-2"
            >
              {/* add google image with this image https://www.google.com/favicon.ico*/}
              <img
                src="https://www.google.com/favicon.ico"
                alt="Google Icon"
                className="inline mr-2 w-4 h-4"
              />
              Google Soal
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
          </div>
          <div className="flex items-center m-4 p-0">
            <Switch
              checked={stateCopySoal}
              onCheckedChange={() => {
                setStateCopySoal(!stateCopySoal);
                chrome.storage.local.set({ copySoal: !stateCopySoal });
              }}
              id="hide-popup"
            />
            <Label
              htmlFor="hide-popup"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 ml-2"
            >
              <LogoSiapDips className="inline mr-2" />
              Copy Soal
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
          </div>
          <div className="flex items-center m-4 p-0">
            <Switch
              checked={stateTanyAI}
              onCheckedChange={() => {
                setStateTanyAI(!stateTanyAI);
                chrome.storage.local.set({ askAi: !stateTanyAI });
              }}
              id="hide-popup"
            />
            <Label
              htmlFor="hide-popup"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 ml-2"
            >
              <img
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcThr7qrIazsvZwJuw-uZCtLzIjaAyVW_ZrlEQ&s"
                alt="Google Icon"
                className="inline mr-2 w-4 h-4"
              />
              Tany AI
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
          </div>
          <div className="flex items-center m-4 p-0">
            <Switch
              checked={stateHelper}
              onCheckedChange={() => {
                setStateHelper(!stateHelper);
                chrome.storage.local.set({ moodleHelper: !stateHelper });
              }}
              id="hide-popup"
            />
            <Label
              htmlFor="hide-popup"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 ml-2"
            >
              ~~HELPER~~
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
          </div>
        </div>
        <Button
          variant={"secondary"}
          className=" p-0"
          onClick={() => {
            chrome.tabs.create({
              url: chrome.runtime.getURL("option.html#sect1"),
            });
          }}
        >
          Tutorial
        </Button>
        <Button
          className="p-0"
          onClick={() => {
            chrome.tabs.create({
              url: chrome.runtime.getURL("option.html#moodleHelper"),
            });
          }}
        >
          <SettingsIcon className="w-4 h-4 mr-2" />
          Settings
        </Button>
      </CardContent>
    </Card>
  );
}

function LogoSiapDips({ ...props }: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 283.46 283.46"
      width="20"
      height="20"
      className="stroke-black dark:stroke-white"
      {...props}
    >
      <path
        d="m94.86,34.25l1.76,30.39c-8.19-.18-14.5-.15-18.92.09-14.12.82-21.15,6.09-21.11,15.79.05,9.27,7.4,13.87,22.06,13.8,7.22-.04,14.6-1.8,22.13-5.28,4.84-2.29,11.88-6.91,21.12-13.85l22.56-15.31c12.25-8.25,22.41-14.18,30.48-17.78,11.08-4.9,21.96-7.38,32.63-7.43,14.01-.07,25.24,3.65,33.69,11.16,9.42,8.25,14.16,19.55,14.23,33.89.07,14.66-5.16,25.68-15.69,33.06-8.17,5.86-19.04,8.93-32.62,9.21-1.08,0-4.8.02-11.16.05l-3.22-30.22c9.59-.05,16.33-.35,20.21-.91,9.26-1.34,13.88-5.62,13.84-12.84-.04-8.63-6.96-12.9-20.76-12.83-7.76.04-14.92,1.85-21.48,5.44-3.98,2.18-12.52,7.66-25.63,16.46l-22.73,15.63c-21.49,14.87-42.21,22.36-62.15,22.46-11.86.06-21.57-2.43-29.14-7.46-11.25-7.38-16.91-19.75-17-37.11-.08-16.39,5.47-28.7,16.64-36.95,5.91-4.45,12.2-7.28,18.88-8.5,5.38-.89,11.96-1.35,19.72-1.39,3.56-.02,7.44.13,11.65.43Z"
        className="stroke-black dark:stroke-white top-path"
        style={{ strokeMiterlimit: 10, strokeWidth: "14px" }}
        fill="none"
      />
      <path
        d="m252.41,161.34l.16,32.99c1.47,35.68-15.37,53.92-50.51,54.74l-119.17.58c-35.15-.48-52.16-18.56-51.04-54.25l-.16-32.99,220.72-1.07Zm-191.95,31.82l.02,3.88c.04,9.06,2.07,15.14,6.07,18.24,3.03,2.25,8.42,3.41,16.19,3.48l119.17-.58c8.84-.15,14.81-2.01,17.92-5.58,2.68-3.25,4.05-8.7,4.13-16.35l-.02-3.88-163.48.79Z"
        className="stroke-black dark:stroke-white bottom-path"
        style={{ strokeMiterlimit: 10, strokeWidth: "14px" }}
        fill="none"
      />
    </svg>
  );
}
