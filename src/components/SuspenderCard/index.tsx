import { DraggableAttributes } from "@dnd-kit/core";
import { SyntheticListenerMap } from "@dnd-kit/core/dist/hooks/utilities";
import { Card, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import { GripHorizontal, HelpCircle, SettingsIcon } from "lucide-react";
import {
  MySelect,
  MySelectContent,
  MySelectItem,
  MySelectTrigger,
} from "../Themecard/select";
import { useEffect, useState } from "react";
import { SuspendPageTimerType } from "@/types/suspendPage";
import { Switch } from "../ui/switch";
import { Label } from "../ui/label";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import { Separator } from "../ui/separator";

export default function SuspenderCard({
  listeners,
  attributes,
}: {
  listeners?: DraggableAttributes;
  attributes?: SyntheticListenerMap;
}) {
  const [timerSuspend, setTimerSuspend] =
    useState<SuspendPageTimerType>("never");
  const [timerAutoCloseSuspend, setTimerAutoCloseSuspend] =
    useState<SuspendPageTimerType>("never");
  const [timerAutoCloseTabs, setTimerAutoCloseTabs] =
    useState<SuspendPageTimerType>("never");
  const [switchSuspendInput, setSwitchSuspendInput] = useState({
    suspendPinnedTabs: false,
    suspendUnsavedInputs: false,
    suspendActiveTab: false,
    suspendAudioTabs: false,
  });
  const [switchCloseInput, setSwitchCloseInput] = useState({
    closePinnedTabs: false,
    closeUnsavedInputs: false,
    closeActiveTab: false,
    closeAudioTabs: false,
  });
  const [hydrated, setHydrated] = useState(false);

  // Load saved settings from local storage
  useEffect(() => {
    chrome.storage.local.get(
      [
        "timerSuspend",
        "timerAutoCloseSuspend",
        "timerAutoCloseTabs",
        //
        "suspendPinnedTabs",
        "suspendUnsavedInputs",
        "suspendActiveTab",
        "suspendAudioTabs",
        //
        "closePinnedTabs",
        "closeUnsavedInputs",
        "closeActiveTab",
        "closeAudioTabs",
      ],
      (result) => {
        setTimerSuspend(result.timerSuspend ?? "never");
        setTimerAutoCloseSuspend(result.timerAutoCloseSuspend ?? "never");
        setTimerAutoCloseTabs(result.timerAutoCloseTabs ?? "never");
        setSwitchSuspendInput({
          suspendPinnedTabs: result.suspendPinnedTabs ?? true,
          suspendUnsavedInputs: result.suspendUnsavedInputs ?? true,
          suspendActiveTab: result.suspendActiveTab ?? true,
          suspendAudioTabs: result.suspendAudioTabs ?? true,
        });
        setSwitchCloseInput({
          closePinnedTabs: result.closePinnedTabs ?? true,
          closeUnsavedInputs: result.closeUnsavedInputs ?? true,
          closeActiveTab: result.closeActiveTab ?? true,
          closeAudioTabs: result.closeAudioTabs ?? true,
        });
        setHydrated(true);
      }
    );
  }, []);

  // Save settings to local storage when they change
  useEffect(() => {
    if (!hydrated) return;
    chrome.storage.local.set({
      timerSuspend,
      timerAutoCloseSuspend,
      timerAutoCloseTabs,
      ...switchSuspendInput,
      ...switchCloseInput,
    });
  }, [
    hydrated,
    timerSuspend,
    timerAutoCloseSuspend,
    timerAutoCloseTabs,
    switchSuspendInput,
    switchCloseInput,
  ]);

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
      <CardContent className="flex flex-col gap-4">
        <div className="text-lg font-semibold">
          Suspender Card {`{optimized for Firefox}`}
        </div>
        <>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Automatically suspend tabs after a period of inactivity to save
            memory and improve browser performance.
          </p>
          <SelectTimerSettings
            value={timerSuspend}
            onChange={setTimerSuspend}
          />
        </>
        <SwitchSettings
          disabled={timerSuspend === "never"}
          state={switchSuspendInput.suspendPinnedTabs}
          func={() => {
            setSwitchSuspendInput((prev) => ({
              ...prev,
              suspendPinnedTabs: !prev.suspendPinnedTabs,
            }));
          }}
          textLabel="Never suspend pinned tabs"
        />
        <SwitchSettings
          disabled={timerSuspend === "never"}
          state={switchSuspendInput.suspendUnsavedInputs}
          func={() => {
            setSwitchSuspendInput((prev) => ({
              ...prev,
              suspendUnsavedInputs: !prev.suspendUnsavedInputs,
            }));
          }}
          textLabel="Never suspend tabs that contain unsaved form inputs"
        />
        <SwitchSettings
          disabled={timerSuspend === "never"}
          state={switchSuspendInput.suspendActiveTab}
          func={() => {
            setSwitchSuspendInput((prev) => ({
              ...prev,
              suspendActiveTab: !prev.suspendActiveTab,
            }));
          }}
          textLabel="Never suspend the active tab"
        />
        <SwitchSettings
          disabled={timerSuspend === "never"}
          state={switchSuspendInput.suspendAudioTabs}
          func={() => {
            setSwitchSuspendInput((prev) => ({
              ...prev,
              suspendAudioTabs: !prev.suspendAudioTabs,
            }));
          }}
          textLabel="Never suspend tabs that are playing audio"
        />
        <SwitchSettings
          disabled={true}
          state={true}
          func={() => {}}
          textLabel="Never suspend tabs that are already suspended by browser"
        />
        <Button
          variant={"destructive"}
          className="p-0"
          onClick={() => {
            if (
              confirm(
                "Are you sure you want to suspend all tabs? This action cannot be undone."
              )
            )
              chrome.runtime.sendMessage({ type: "suspendAllTabsNow" });
          }}
        >
          Suspend all those tabs now
        </Button>

        <Separator className="border-t-4 w-full my-2 border-black" />

        <>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Automatically close suspended tabs after a certain period of time
            without user interaction. This helps keep your browser clean
          </p>
          <SelectTimerSettings
            value={timerAutoCloseSuspend}
            onChange={setTimerAutoCloseSuspend}
          />
        </>

        <Button
          className="p-0"
          onClick={() => {
            if (
              confirm(
                "Are you sure you want to close all suspended tabs? This action cannot be undone."
              )
            )
              chrome.runtime.sendMessage({ type: "closeAllSuspendedTabsNow" });
          }}
          variant={"destructive"}
        >
          Close All suspended tabs now
        </Button>

        <Separator className="border-t-4 w-full my-2 border-black" />

        <>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Automatically close tabs
          </p>
          <SelectTimerSettings
            value={timerAutoCloseTabs}
            onChange={setTimerAutoCloseTabs}
          />
        </>

        <SwitchSettings
          disabled={timerAutoCloseTabs === "never"}
          state={switchCloseInput.closePinnedTabs}
          func={() => {
            setSwitchCloseInput((prev) => ({
              ...prev,
              closePinnedTabs: !prev.closePinnedTabs,
            }));
          }}
          textLabel="Never close pinned tabs"
        />
        <SwitchSettings
          disabled={timerAutoCloseTabs === "never"}
          state={switchCloseInput.closeUnsavedInputs}
          func={() => {
            setSwitchCloseInput((prev) => ({
              ...prev,
              closeUnsavedInputs: !prev.closeUnsavedInputs,
            }));
          }}
          textLabel="Never close tabs that contain unsaved form inputs"
        />
        <SwitchSettings
          disabled={timerAutoCloseTabs === "never"}
          state={switchCloseInput.closeActiveTab}
          func={() => {
            setSwitchCloseInput((prev) => ({
              ...prev,
              closeActiveTab: !prev.closeActiveTab,
            }));
          }}
          textLabel="Never close the active tab"
        />
        <SwitchSettings
          disabled={timerAutoCloseTabs === "never"}
          state={switchCloseInput.closeAudioTabs}
          func={() => {
            setSwitchCloseInput((prev) => ({
              ...prev,
              closeAudioTabs: !prev.closeAudioTabs,
            }));
          }}
          textLabel="Never close tabs that are playing audio"
        />

        <Button
          variant={"destructive"}
          onClick={() => {
            if (
              confirm(
                "Are you sure you want to close all tabs? This action cannot be undone."
              )
            )
              chrome.runtime.sendMessage({ type: "closeAllTabsNow" });
          }}
        >
          Close those tabs now
        </Button>

        <Separator className="border-t-4 w-full my-2 border-black" />

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
        <Button
          className="p-0"
          onClick={() => {
            chrome.tabs.create({
              url: "https://www.reddit.com/r/zen_browser/comments/1luoptt/auto_close_and_suspends_tabs_extension/",
            });
          }}
        >
          <HelpCircle className="w-4 h-4 mr-2" />
          Tutorial
        </Button>
      </CardContent>
    </Card>
  );
}

const SwitchSettings = ({
  state,
  func,
  textLabel,
  disabled,
  tooltip,
}: {
  state: boolean;
  func: (checked: boolean) => void;
  textLabel: string;
  disabled?: boolean;
  tooltip?: string;
}) => {
  return (
    <div className="flex">
      <Switch
        disabled={disabled}
        checked={state}
        onCheckedChange={func}
        id="hide-popup"
      />
      <Label
        htmlFor="hide-popup"
        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 ml-2"
      >
        {textLabel}
      </Label>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <HelpCircle className="h-4 w-4 text-muted-foreground cursor-help ml-2" />
          </TooltipTrigger>
          <TooltipContent>{tooltip}</TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
};

const SelectTimerSettings = ({
  value,
  onChange,
}: {
  value: SuspendPageTimerType;
  onChange: React.Dispatch<React.SetStateAction<SuspendPageTimerType>>;
}) => {
  return (
    <MySelect value={value} onChange={onChange} placeholder="">
      <MySelectTrigger className="w-[200px]">{value}</MySelectTrigger>
      <MySelectContent>
        <MySelectItem value="never">Never</MySelectItem>
        <MySelectItem value="20s">20 seconds</MySelectItem>
        <MySelectItem value="1m">1 min</MySelectItem>
        <MySelectItem value="5m">5 mins</MySelectItem>
        <MySelectItem value="10m">10 mins</MySelectItem>
        <MySelectItem value="15m">15 mins</MySelectItem>
        <MySelectItem value="30m">30 mins</MySelectItem>
        <MySelectItem value="1h">1 hour</MySelectItem>
        <MySelectItem value="2h">2 hours</MySelectItem>
        <MySelectItem value="4h">4 hours</MySelectItem>
        <MySelectItem value="6h">6 hours</MySelectItem>
        <MySelectItem value="12h">12 hours</MySelectItem>
        <MySelectItem value="1d">1 day</MySelectItem>
        <MySelectItem value="2d">2 days</MySelectItem>
        <MySelectItem value="3d">3 days</MySelectItem>
        <MySelectItem value="1w">1 week</MySelectItem>
        <MySelectItem value="2w">2 weeks</MySelectItem>
      </MySelectContent>
    </MySelect>
  );
};
