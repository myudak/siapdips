import { useEffect, useState } from "react";
import type { DraggableAttributes } from "@dnd-kit/core";
import type { SyntheticListenerMap } from "@dnd-kit/core/dist/hooks/utilities";
import {
  ExternalLink,
  GripHorizontal,
  Radar,
  Search,
  RefreshCcw,
} from "lucide-react";

import HideButton from "../hideButton";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Label } from "../ui/label";
import { Switch } from "../ui/switch";
import { toast } from "sonner";

const DYANDRA_URL = "https://dyandraglobalstore-02.com/";
const STORAGE_KEY_DYANDRA_HELPER_ENABLED = "dyandraHelperEnabled";

function isDyandraUrl(url?: string): boolean {
  return url === "https://dyandraglobalstore-02.com" || url?.startsWith(DYANDRA_URL) === true;
}

const DyandraLoketCard = ({
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
    chrome.storage.local.get([STORAGE_KEY_DYANDRA_HELPER_ENABLED], (result) => {
      if (chrome.runtime.lastError) {
        console.warn("[Dyandra Card] load error", chrome.runtime.lastError);
        return;
      }

      if (result[STORAGE_KEY_DYANDRA_HELPER_ENABLED] === undefined) {
        chrome.storage.local.set({ [STORAGE_KEY_DYANDRA_HELPER_ENABLED]: true });
        setEnabled(true);
        return;
      }

      setEnabled(Boolean(result[STORAGE_KEY_DYANDRA_HELPER_ENABLED]));
    });
  }, []);

  const runOnDyandraTab = async (
    action: (tabId: number) => Promise<void>,
    onMissing?: () => void
  ) => {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (!tab?.id || !isDyandraUrl(tab.url)) {
      onMissing?.();
      return;
    }
    await action(tab.id);
  };

  const toggleHelper = async (checked: boolean) => {
    setEnabled(checked);
    await chrome.storage.local.set({ [STORAGE_KEY_DYANDRA_HELPER_ENABLED]: checked });

    await runOnDyandraTab(
      async (tabId) => {
        await chrome.scripting.executeScript({
          target: { tabId },
          func: (nextEnabled) => {
            const api = window as unknown as {
              showDyandraHelper?: () => void;
              hideDyandraHelper?: () => void;
              stopDyandraWatcher?: () => void;
            };
            if (nextEnabled) {
              api.showDyandraHelper?.();
            } else {
              api.stopDyandraWatcher?.();
              api.hideDyandraHelper?.();
            }
          },
          args: [checked],
        });
      },
      () => {
        toast.message(
          checked
            ? "Helper Dyandra udah nyala. Buka websitenya buat lihat overlay-nya."
            : "Helper Dyandra dimatiin."
        );
      }
    );
  };

  const openWebsite = () => {
    chrome.tabs.create({ url: DYANDRA_URL });
  };

  const showHelperNow = async () => {
    await runOnDyandraTab(
      async (tabId) => {
        await chrome.scripting.executeScript({
          target: { tabId },
          func: () => {
            const api = window as unknown as {
              showDyandraHelper?: () => void;
            };
            api.showDyandraHelper?.();
          },
        });
      },
      () => {
        toast.error("Buka tab Dyandra dulu ya.");
      }
    );
  };

  const checkNow = async () => {
    await runOnDyandraTab(
      async (tabId) => {
        await chrome.scripting.executeScript({
          target: { tabId },
          func: () => {
            const api = window as unknown as {
              scanDyandraLoketNow?: () => void;
            };
            api.scanDyandraLoketNow?.();
          },
        });
      },
      () => {
        toast.error("Buka tab Dyandra dulu ya.");
      }
    );
  };

  const refreshNow = async () => {
    await runOnDyandraTab(
      async (tabId) => {
        await chrome.scripting.executeScript({
          target: { tabId },
          func: () => {
            const api = window as unknown as {
              refreshDyandraNow?: () => void;
            };
            api.refreshDyandraNow?.();
          },
        });
      },
      () => {
        toast.error("Buka tab Dyandra dulu ya.");
      }
    );
  };

  return (
    <Card className="relative group w-full dark:bg-gray-800 dark:border-gray-700">
      <HideButton
        id={id || "DyandraLoketCard"}
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
          <Radar className="h-5 w-5" />
          Dyandra Loket Helper
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">
          Helper ini bakal bantu refresh halaman Dyandra, cek link Loket,
          terus auto buka kalau teks targetnya ketemu.
        </p>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Switch checked={enabled} onCheckedChange={toggleHelper} id="dyandra-helper" />
            <Label htmlFor="dyandra-helper">Auto helper di page</Label>
          </div>
        </div>

        <div className="grid gap-2">
          <Button className="w-full" onClick={showHelperNow}>
            <Radar className="h-4 w-4 mr-2" />
            Tampilin Helper
          </Button>
          <div className="grid gap-2 sm:grid-cols-2">
            <Button variant="secondary" className="w-full" onClick={checkNow}>
              <Search className="h-4 w-4 mr-2" />
              Cek Sekarang
            </Button>
            <Button variant="secondary" className="w-full" onClick={refreshNow}>
              <RefreshCcw className="h-4 w-4 mr-2" />
              Refresh Sekarang
            </Button>
          </div>
          <Button variant="outline" className="w-full" onClick={openWebsite}>
            <ExternalLink className="h-4 w-4 mr-2" />
            Buka Dyandra
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default DyandraLoketCard;
