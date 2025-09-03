import { SetStateAction, useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

import {
  Moon,
  Sun,
  LineChart,
  UserCircle,
  GripHorizontal,
  HelpCircle,
} from "lucide-react";
import { Switch } from "../ui/switch";
import { Label } from "../ui/label";
import { getActiveTab } from "@/lib/utils";
import { DraggableAttributes } from "@dnd-kit/core";
import { SyntheticListenerMap } from "@dnd-kit/core/dist/hooks/utilities";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import {
  MySelect,
  MySelectTrigger,
  MySelectContent,
  MySelectItem,
} from "./select";

const darkModeAllowedUrls: string[] = [
  "https://siap.undip.ac.id/",
  "https://sso.undip.ac.id/",
  "https://kulon2.undip.ac.id/",
];

const UndipThemeSettings = ({
  listeners,
  attributes,
}: {
  listeners?: DraggableAttributes;
  attributes?: SyntheticListenerMap;
}) => {
  // const [openCustomValue, setOpenCustomValue] = useState(false);
  const [isEnabled, setIsEnabled] = useState(false);
  const [mode, setMode] = useState("custom");
  const [customColor, setCustomColor] = useState("custom");
  const [profile, setProfile] = useState({
    avatarUrl: null,
    username: null,
    nim: null,
    prodi: null,
    blurUsername: false,
    blurNim: false,
    blurProdi: false,
  });

  const colors: Record<string, string> = {
    blue: "bg-blue-600",
    red: "bg-red-600",
    green: "bg-green-600",
    purple: "bg-purple-600",
    indigo: "bg-indigo-600",
    teal: "bg-teal-600",
  };

  const textColors: Record<string, string> = {
    blue: "text-blue-600",
    red: "text-red-600",
    green: "text-green-600",
    purple: "text-purple-600",
    indigo: "text-indigo-600",
    teal: "text-teal-600",
    dark: "text-gray-600",
    light: "text-gray-600",
  };

  const onClickEnableSwitch = async (value: boolean) => {
    setIsEnabled(value);
    await chrome.storage.local.set({ undipCustomTheme: value });

    const tabId = await getActiveTab();
    const [tab] = await chrome.tabs.query({
      active: true,
      currentWindow: true,
    });
    if (!darkModeAllowedUrls.some((url) => tab.url?.includes(url))) return;

    if (value) {
      await chrome.scripting
        .insertCSS({
          files: ["mode.min.css"],
          target: { tabId: tabId },
        })
        .catch((error: unknown) => {
          console.error("Failed to inject CSS:", error);
        });
    }
    if (!value) {
      await chrome.scripting
        .removeCSS({
          files: ["mode.min.css"],
          target: { tabId: tabId },
        })
        .catch((error: unknown) => {
          console.error("Failed to remove CSS:", error);
        });
    }
  };

  useEffect(() => {
    const getLocalStorage = async () => {
      const localStorage = await chrome.storage.local.get([
        "undipCustomTheme",
        "undipCustomThemeValue",
      ]);
      if (
        localStorage.undipCustomThemeValue === "dark" ||
        localStorage.undipCustomTheme === "light"
      )
        setMode(localStorage.undipCustomThemeValue);
      else {
        setCustomColor(localStorage.undipCustomThemeValue);
      }
      if (localStorage.undipCustomTheme === undefined) return;
      setIsEnabled(localStorage.undipCustomTheme);
    };
    const getProfile = async () => {
      const result = await chrome.storage.local.get([
        "profileImageLocal",
        "profileNameLocal",
        "profileNim",
        "profileProdi",
        "isBlurredUsername",
        "isBlurredNim",
        "isBlurredProdi",
      ]);
      console.log(result);
      setProfile({
        avatarUrl: result.profileImageLocal,
        username: result.profileNameLocal,
        nim: result.profileNim,
        prodi: result.profileProdi,
        blurUsername: result.isBlurredUsername,
        blurNim: result.isBlurredNim,
        blurProdi: result.isBlurredProdi,
      });
    };
    getProfile();
    getLocalStorage();
  }, []);

  const setModeTab = (args: SetStateAction<string>) => {
    setMode(args);
    setCustomColor("custom");
  };

  const setCustomColorTab = (args: SetStateAction<string>) => {
    console.log("setCustomColorTab", args);
    setCustomColor(args);
    setMode("custom");
  };

  useEffect(() => {
    console.log("USE EFFECT");
    if (mode === "custom") {
      chrome.storage.local.set({ undipCustomThemeValue: customColor });
    }
    if (customColor === "custom") {
      chrome.storage.local.set({ undipCustomThemeValue: mode });
    }
    const ainc = async () => {
      const tabId = await getActiveTab();
      await chrome.scripting
        .executeScript({
          target: { tabId: tabId },
          args: [mode, customColor],
          func: (mode, customColor) => {
            console.log("mode: ", mode);
            console.log("customColor: ", customColor);
            const a = [
              "dark-theme",
              "light-theme",
              "blue-theme",
              "red-theme",
              "green-theme",
              "purple-theme",
              "indigo-theme",
              "teal-theme",
            ];
            document.documentElement.classList.remove(...a);

            if (mode === "custom") {
              document.documentElement.classList.add(`${customColor}-theme`);
            }
            if (customColor === "custom") {
              document.documentElement.classList.add(`${mode}-theme`);
            }
          },
        })
        .catch((error: unknown) => {
          console.error("Failed to inject CSS:", error);
        });
    };
    ainc();
  }, [mode, customColor]);

  console.log(customColor !== "custom");
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
      <CardHeader>
        <CardTitle className="text-xl font-bold">
          Undip Theme Settings
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <HelpCircle className="h-4 w-4 text-muted-foreground cursor-help ml-2 inline" />
              </TooltipTrigger>
              <TooltipContent
                onClick={() => chrome.tabs.create({ url: "option.html#Theme" })}
                title="Tutorial Theme"
              >
                <video
                  src="/video/Vid-Theme.mp4"
                  autoPlay
                  loop
                  muted
                  className="max-w-xs cursor-pointer"
                />
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Enable/Disable Switch */}
        <div className="flex items-center space-x-2">
          <Switch
            checked={isEnabled}
            onCheckedChange={onClickEnableSwitch}
            id="theme-enable"
          />
          <Label htmlFor="theme-enable">Enable Custom Themes</Label>
        </div>
        {/* Mode Selection */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Theme Mode</label>
          <Tabs value={mode} onValueChange={setModeTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger
                value="dark"
                disabled={!isEnabled}
                className="flex items-center gap-2"
              >
                <Moon className="h-4 w-4" />
                Dark
              </TabsTrigger>
              <TabsTrigger
                disabled={!isEnabled}
                value="light"
                className="flex items-center gap-2"
              >
                <Sun className="h-4 w-4" />
                Light
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* Custom Color Selection */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Custom Color</label>
          <MySelect
            value={customColor}
            onChange={setCustomColorTab}
            disabled={!isEnabled}
            placeholder=""
          >
            <MySelectTrigger className="w-full" title="Custom Color">
              {customColor !== "custom" ? (
                <div className="flex items-center gap-2">
                  <div
                    className={`h-4 w-4 rounded-full ${
                      colors[customColor] || ""
                    }`}
                  />
                  <span className="capitalize">{customColor}</span>
                </div>
              ) : (
                <span>Select a color</span>
              )}
            </MySelectTrigger>
            <MySelectContent>
              {Object.entries(colors).map(([name, bgClass]) => (
                <MySelectItem key={name} value={name}>
                  <div className="flex items-center gap-2">
                    <div className={`h-4 w-4 rounded-full ${bgClass}`} />
                    <span className="capitalize">{name}</span>
                  </div>
                </MySelectItem>
              ))}
            </MySelectContent>
          </MySelect>
        </div>

        {/* Preview */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Preview</label>
          <div
            className={`overflow-hidden rounded-lg border ${
              !isEnabled ? "opacity-50" : ""
            }`}
          >
            {/* Header Background */}
            <div className={`relative ${colors[customColor]} p-6 h-32`}>
              {/* Profile Section */}
              <div className="absolute bottom-0 left-0 right-0 flex items-end px-6 pb-4">
                <div className="flex items-end space-x-4">
                  <div className="h-20 w-20 overflow-hidden rounded-full border-4 border-white bg-white">
                    <img
                      src={profile.avatarUrl || "images/profile.webp"}
                      alt="Profile"
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="mb-2 text-white">
                    <h2
                      className={`text-xl font-bold ${
                        profile.blurUsername ? "blur-sm" : ""
                      }`}
                    >
                      {profile.username || "NAMA"}
                    </h2>
                    <p className="text-sm opacity-90">
                      <span className={`${profile.blurNim ? "blur-sm" : ""}`}>
                        NIM: {profile.nim || "NIM"}
                      </span>{" "}
                      | {profile.prodi || "PRODI"}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Navigation Bar */}
            <div
              className={`border-t ${
                ["dark"].includes(mode) ? "bg-black" : "bg-white"
              } p-2`}
            >
              <div className="flex gap-4">
                <Button
                  variant="ghost"
                  disabled={!isEnabled}
                  className={`${
                    textColors[customColor] ||
                    textColors[mode] ||
                    "text-gray-500"
                  } text-sm`}
                >
                  <LineChart className="mr-2 h-4 w-4" />
                  Dasbor
                </Button>
                <Button
                  disabled={!isEnabled}
                  variant="ghost"
                  className={`${
                    textColors[customColor] ||
                    textColors[mode] ||
                    "text-gray-500"
                  } text-sm`}
                >
                  <UserCircle className="mr-2 h-4 w-4" />
                  Biodata
                </Button>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
export default UndipThemeSettings;
