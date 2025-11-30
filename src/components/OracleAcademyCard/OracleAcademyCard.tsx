import { useEffect, useState } from "react";
import { DraggableAttributes } from "@dnd-kit/core";
import { SyntheticListenerMap } from "@dnd-kit/core/dist/hooks/utilities";
import { GraduationCap, GripHorizontal, Sparkles, PlayIcon } from "lucide-react";

import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Label } from "../ui/label";
import { Switch } from "../ui/switch";
import HideButton from "../hideButton";

type Props = {
  listeners?: DraggableAttributes;
  attributes?: SyntheticListenerMap;
  id?: string;
};

export default function OracleAcademyCard({ listeners, attributes, id }: Props) {
  const [autoHelper, setAutoHelper] = useState(true);
  const storageKey = "oracleAcademyHelperEnabled";
  const autoNextKey = "oracleAcademyAutoNextEnabled";
  const [autoNext, setAutoNext] = useState(false);

  useEffect(() => {
    chrome.storage.local.get([storageKey], (res) => {
      if (chrome.runtime.lastError) {
        console.warn("[Oracle Academy Card] load error", chrome.runtime.lastError);
        return;
      }
      if (res[storageKey] === undefined) {
        chrome.storage.local.set({ [storageKey]: true });
        setAutoHelper(true);
      } else {
        setAutoHelper(!!res[storageKey]);
      }
    });
    chrome.storage.local.get([autoNextKey], (res) => {
      if (chrome.runtime.lastError) {
        console.warn("[Oracle Academy Card] load error", chrome.runtime.lastError);
        return;
      }
      setAutoNext(!!res[autoNextKey]);
    });
  }, []);

  const runOnOracleTab = async (action: (tabId: number) => Promise<void>) => {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (!tab?.id || !tab.url?.includes("https://academy.oracle.com/pls/")) {
      console.warn("[Oracle Academy Card] Not on Oracle Academy tab.");
      return;
    }
    await action(tab.id);
  };

  const triggerAnswerAndSubmit = async () => {
    await runOnOracleTab(async (tabId) => {
      await chrome.scripting.executeScript({
        target: { tabId },
        func: () => {
          const fn = (window as unknown as { answerOracleAcademyQuiz?: () => void })
            .answerOracleAcademyQuiz;
          if (fn) {
            fn();
          } else {
            console.warn("[Oracle Academy Card] answerOracleAcademyQuiz not found on page.");
          }
        },
      });
    });
  };

  const triggerShowHelper = async () => {
    await runOnOracleTab(async (tabId) => {
      await chrome.scripting.executeScript({
        target: { tabId },
        func: () => {
          const fn = (window as unknown as { showOracleAcademyHelper?: () => void })
            .showOracleAcademyHelper;
          if (fn) {
            fn();
          } else {
            console.warn("[Oracle Academy Card] showOracleAcademyHelper not found on page.");
          }
        },
      });
    });
  };

  const triggerClickNextOnce = async () => {
    await runOnOracleTab(async (tabId) => {
      await chrome.scripting.executeScript({
        target: { tabId },
        func: () => {
          const fn = (window as unknown as { clickOracleNext?: () => void })
            .clickOracleNext;
          if (fn) fn();
        },
      });
    });
  };

  const triggerAutoNext = async (enabled: boolean) => {
    await runOnOracleTab(async (tabId) => {
      await chrome.scripting.executeScript({
        target: { tabId },
        func: (on) => {
          const api = window as unknown as {
            startOracleAutoNext?: () => void;
            stopOracleAutoNext?: () => void;
          };
          if (on) {
            api.startOracleAutoNext?.();
          } else {
            api.stopOracleAutoNext?.();
          }
        },
        args: [enabled],
      });
    });
  };

  const handleToggle = async (checked: boolean) => {
    setAutoHelper(checked);
    chrome.storage.local.set({ [storageKey]: checked });
    if (checked) {
      // If turning on, try to show helper immediately on the active Oracle tab.
      triggerShowHelper();
    }
  };

  const handleAutoNextToggle = async (checked: boolean) => {
    setAutoNext(checked);
    chrome.storage.local.set({ [autoNextKey]: checked });
    await triggerAutoNext(checked);
  };

  return (
    <Card className="relative group w-full dark:bg-gray-800 dark:border-gray-700">
      <HideButton
        id={id || "OracleAcademyCard"}
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

      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-bold flex items-center gap-2">
          <GraduationCap className="h-5 w-5" />
          Oracle Academy Helper
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Switch checked={autoHelper} onCheckedChange={handleToggle} id="oracle-auto-helper" />
            <Label htmlFor="oracle-auto-helper">Auto helper on page</Label>
          </div>
        </div>

        <div className="grid gap-2">
          <Button className="w-full" onClick={triggerAnswerAndSubmit}>
            <Sparkles className="h-4 w-4 mr-2" />
            Answer &amp; Submit
          </Button>
          <Button variant="secondary" className="w-full" onClick={triggerShowHelper}>
            Show helper window
          </Button>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Switch
                checked={autoNext}
                onCheckedChange={handleAutoNextToggle}
                id="oracle-auto-next"
              />
              <Label htmlFor="oracle-auto-next">Auto Next</Label>
            </div>
            <Button size="sm" variant="outline" onClick={triggerClickNextOnce}>
              <PlayIcon className="h-4 w-4 mr-1" />
              Next once
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
