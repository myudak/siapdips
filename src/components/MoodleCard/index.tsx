import { BrandLogo as LogoSiapDips } from "@/components/BrandLogo";
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
import HideButton from "../hideButton";
export default function MoodleCard({
  listeners,
  attributes,
  id,
}: {
  listeners?: DraggableAttributes;
  attributes?: SyntheticListenerMap;
  id: string;
}) {
  const [stateGoogleSoal, setStateGoogleSoal] = useState(true);
  const [stateCopySoal, setStateCopySoal] = useState(true);
  const [stateTanyAI, setStateTanyAI] = useState(true);
  const [stateAnswerChatGpt, setStateAnswerChatGpt] = useState(false);
  const [stateHelper, setStateHelper] = useState(false);

  useEffect(() => {
    // Load saved settings from local storage
    chrome.storage.local.get(
      ["googleSoal", "copySoal", "askAi", "answerChatGpt", "moodleHelper"],
      (result) => {
        if (
          result.googleSoal === undefined ||
          result.copySoal === undefined ||
          result.askAi === undefined ||
          result.moodleHelper === undefined
        ) {
          // If settings are not found, set default values.
          // `answerChatGpt` is deliberately left out of the condition above:
          // it is missing for everyone who used the extension before it
          // existed, and checking it here would rewrite the four settings
          // below back to their defaults. It is off when unset anyway.
          chrome.storage.local.set({
            googleSoal: true,
            copySoal: true,
            askAi: true,
            answerChatGpt: false,
            moodleHelper: false,
          });
        }
        setStateGoogleSoal(result.googleSoal);
        setStateCopySoal(result.copySoal);
        setStateTanyAI(result.askAi);
        setStateAnswerChatGpt(result.answerChatGpt === true);
        setStateHelper(result.moodleHelper);
      }
    );
  }, []);

  return (
    <Card className="relative group w-full dark:bg-gray-800 dark:border-gray-700 ">
      <HideButton
        id={id}
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
              checked={stateAnswerChatGpt}
              onCheckedChange={() => {
                setStateAnswerChatGpt(!stateAnswerChatGpt);
                chrome.storage.local.set({
                  answerChatGpt: !stateAnswerChatGpt,
                });
              }}
              id="answer-chatgpt"
            />
            <Label
              htmlFor="answer-chatgpt"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 ml-2"
            >
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/1/13/ChatGPT-Logo.png"
                alt=""
                className="inline mr-2 w-4 h-4"
              />
              Answer ChatGPT
            </Label>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <HelpCircle className="h-4 w-4 text-muted-foreground cursor-help ml-2" />
                </TooltipTrigger>
                <TooltipContent>berlaku di halaman kuis Moodle</TooltipContent>
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
