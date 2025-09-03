import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { DraggableAttributes } from "@dnd-kit/core";
import { SyntheticListenerMap } from "@dnd-kit/core/dist/hooks/utilities";
import {
  BotMessageSquare,
  GripHorizontal,
  HelpCircle,
  Link2,
  SettingsIcon,
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

const AutopbmCard = ({
  listeners,
  attributes,
}: {
  listeners?: DraggableAttributes;
  attributes?: SyntheticListenerMap;
}) => {
  const [settingsPBM, setSettingsPBM] = useState(defaultSettingsPBM);

  useEffect(() => {
    const getSettingsPBM = async () => {
      const settingsPBM = await chrome.storage.local.get(["settingsPBM"]);
      if (settingsPBM.settingsPBM) {
        setSettingsPBM(settingsPBM.settingsPBM);
      } else {
        await chrome.storage.local.set({ settingsPBM: defaultSettingsPBM });
        setSettingsPBM(defaultSettingsPBM);
      }
    };
    getSettingsPBM();
  }, []);

  const handleClickAutoThis = async () => {
    const tabId = await getActiveTab();
    await chrome.scripting.executeScript({
      target: { tabId: tabId },
      args: [settingsPBM],
      func: automateTableResponses,
    });
  };

  return (
    <>
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
        <CardHeader className="py-2">
          <CardTitle className="text-lg font-bold">
            Auto PBM
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <HelpCircle className="h-4 w-4 text-muted-foreground cursor-help ml-2 inline" />
                </TooltipTrigger>
                <TooltipContent
                  onClick={() =>
                    chrome.tabs.create({ url: "option.html#Autopbm" })
                  }
                  title="Tutorial PBM"
                >
                  <video
                    src="/video/Vid-Pbm.mp4"
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
        <CardContent className="space-y-1 flex flex-col">
          <Button className="w-full" onClick={handleClickAutoThis}>
            <BotMessageSquare className="w-4 h-4 mr-2" />
            ~Auto This~
          </Button>
          <Button
            variant={"secondary"}
            className="w-full"
            onClick={() => {
              chrome.tabs.create({
                url: chrome.runtime.getURL("option.html#PBMTable"),
              });
            }}
          >
            <SettingsIcon className="w-4 h-4 mr-2" />
            Setting Template
          </Button>
          <Button
            variant={"secondary"}
            className="w-full"
            onClick={() =>
              chrome.tabs.create({
                url: "https://siap.undip.ac.id/evaluasi_perkuliahan/mhs/evaluasi",
              })
            }
          >
            <Link2 className="w-4 h-4 mr-2" />
            Goto PBM ~&gt;
          </Button>
        </CardContent>
      </Card>
    </>
  );
};

function automateTableResponses(settings: { [key: number]: string }) {
  const tbody = document.querySelector("tbody");
  if (!tbody) {
    console.error("Could not find the <tbody> element.");
    return;
  }

  const rows = tbody.querySelectorAll("tr");

  let questionNumber = 0;

  rows.forEach((row) => {
    // Skip header rows (they have a 'text-bold-700' class)
    if (row.classList.contains("text-bold-700")) {
      return;
    }

    const radioDiv = row.querySelector("td:last-child .row");

    if (radioDiv) {
      questionNumber++;
      const adaRadio = radioDiv.querySelector(
        `input[value="Ada"]`
      ) as HTMLElement;
      const tidakRadio = radioDiv.querySelector(
        `input[value="Tidak"]`
      ) as HTMLElement;

      const YaRadio = radioDiv.querySelector(
        `input[value="Ya"]`
      ) as HTMLElement;

      // KONEKSI INTERNET
      const WifiRumahKosRadio = radioDiv.querySelector(
        `input[value="Wifi Rumah/Kos"]`
      ) as HTMLElement;
      const InternetHPRadio = radioDiv.querySelector(
        `input[value="Internet HP"]`
      ) as HTMLElement;
      const WifiKampusRadio = radioDiv.querySelector(
        `input[value="Wifi Kampus"]`
      ) as HTMLElement;
      const TetheringTemanRadio = radioDiv.querySelector(
        `input[value="Tethering Teman"]`
      ) as HTMLElement;

      // PERANGKAT
      const HPRadio = radioDiv.querySelector(
        `input[value="HP"]`
      ) as HTMLElement;
      const LaptopRadio = radioDiv.querySelector(
        `input[value="Laptop"]`
      ) as HTMLElement;
      const DesktopRadio = radioDiv.querySelector(
        `input[value="Desktop"]`
      ) as HTMLElement;

      // METODE
      const KuliahOnlineRadio = radioDiv.querySelector(
        `input[value="Kuliah Online"]`
      ) as HTMLElement;
      const TatapMukaRadio = radioDiv.querySelector(
        `input[value="Tatap Muka"]`
      ) as HTMLElement;

      // Media
      const WebexRadio = radioDiv.querySelector(
        `input[value="Webex"]`
      ) as HTMLElement;
      const MsTeamsRadio = radioDiv.querySelector(
        `input[value="Ms Teams"]`
      ) as HTMLElement;
      const LainnyaRadio = radioDiv.querySelector(
        `input[value="Lainnya"]`
      ) as HTMLElement;

      if (
        adaRadio ||
        tidakRadio ||
        YaRadio ||
        WifiRumahKosRadio ||
        HPRadio ||
        KuliahOnlineRadio ||
        WebexRadio
      ) {
        const setting = settings[questionNumber];

        if (setting === "Ada" && adaRadio) {
          adaRadio.click();
        } else if (setting === "Tidak" && tidakRadio) {
          tidakRadio.click();
        } else if (setting === "Ya" && YaRadio) {
          YaRadio.click();
        }

        // KONEKSI INTERNET
        else if (setting === "Wifi Rumah/Kos" && WifiRumahKosRadio) {
          WifiRumahKosRadio.click();
        } else if (setting === "Internet HP" && InternetHPRadio) {
          InternetHPRadio.click();
        } else if (setting === "Wifi Kampus" && WifiKampusRadio) {
          WifiKampusRadio.click();
        } else if (setting === "Tethering Teman" && TetheringTemanRadio) {
          TetheringTemanRadio.click();
        }

        // PERANGKAT
        else if (setting === "HP" && HPRadio) {
          HPRadio.click();
        } else if (setting === "Laptop" && LaptopRadio) {
          LaptopRadio.click();
        } else if (setting === "Desktop" && DesktopRadio) {
          DesktopRadio.click();
        }

        // METODE
        else if (setting === "Kuliah Online" && KuliahOnlineRadio) {
          KuliahOnlineRadio.click();
        } else if (setting === "Tatap Muka" && TatapMukaRadio) {
          TatapMukaRadio.click();
        }

        // Media
        else if (setting === "Ms Teams" && MsTeamsRadio) {
          MsTeamsRadio.click();
        } else if (setting === "Lainnya" && LainnyaRadio) {
          LainnyaRadio.click();
        } else if (setting === "Webex" && WebexRadio) {
          WebexRadio.click();
        }
      } else {
        console.warn(
          `Could not find radio buttons for question number ${questionNumber}`
        );
      }
    }
  });
}

const defaultSettingsPBM = {
  1: "Ada",
  2: "Ada",
  3: "Ada",
  4: "Ada",
  5: "Ada",
  6: "Ada",
  7: "Ada",
  8: "Ada",
  9: "Ada",
  10: "Ada",
  11: "Ada",
  12: "Ya",
  13: "Wifi Rumah/Kos",
  14: "Laptop",
  15: "Kuliah Online",
  16: "Lainnya",
  17: "Ada",
  18: "Ada",
  19: "Ada",
  20: "Ada",
  21: "Ada",
  22: "Ada",
  23: "Ada",
  24: "Ada",
  25: "Ya",
  26: "Ya",
  27: "Ya",
  28: "Ya",
  29: "Ya",
  30: "Ya",
  31: "Ya",
  32: "Ya",
  33: "Ya",
  34: "Ya",
};

export default AutopbmCard;
