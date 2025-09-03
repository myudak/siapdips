import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  BotMessageSquare,
  GripHorizontal,
  HelpCircle,
  Link2Icon,
  TimerIcon,
} from "lucide-react";
import { DraggableAttributes } from "@dnd-kit/core";
import { SyntheticListenerMap } from "@dnd-kit/core/dist/hooks/utilities";

const AutoFoodTruk = ({
  listeners,
  attributes,
}: {
  listeners?: DraggableAttributes;
  attributes?: SyntheticListenerMap;
}) => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (date: Date) => {
    return `${date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    })}`;
  };

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
      <CardHeader className="py-2 text-center">
        <CardTitle className="text-lg font-bold">
          FoodTruk {"{Helper}"}
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <HelpCircle className="h-4 w-4 text-muted-foreground cursor-help ml-2 inline" />
              </TooltipTrigger>
              <TooltipContent
                title="Tutorial PBM"
                onClick={() =>
                  chrome.tabs.create({
                    url: "option.html#Autopbm",
                  })
                }
              >
                <video
                  src="/video/vid-foodtruk.mp4"
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
        <div className="text-4xl font-bold text-primary mb-2 text-center">
          {formatTime(currentTime)}
        </div>
        <Button
          className="w-full"
          onClick={async () => {
            const [tab] = await chrome.tabs.query({
              active: true,
              currentWindow: true,
            });
            if (!tab?.id) return;
            if (!tab.url?.includes("https://form.undip.ac.id/makanansehat")) {
              await chrome.scripting.executeScript({
                target: { tabId: tab.id },
                files: ["libs/toastify.js"],
              });
              await chrome.scripting.insertCSS({
                target: { tabId: tab.id },
                files: ["libs/toastify.css"],
              });
              await chrome.scripting.executeScript({
                target: { tabId: tab.id },
                func: () => {
                  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                  // @ts-ignore
                  Toastify({
                    text: "Siap DIps ~~> BUKAN FOOD TRUK `(*>﹏<*)′",
                    duration: 3000,
                    close: true,
                    position: "left",
                  }).showToast();
                },
              });
              return;
            }

            await chrome.scripting.executeScript({
              target: { tabId: tab.id },
              files: ["content-ft.js"],
            });
          }}
        >
          <BotMessageSquare className="w-4 h-4 mr-2" />
          ~Add~
        </Button>
        <Button
          className="w-full"
          variant={"secondary"}
          onClick={() =>
            chrome.tabs.create({
              url: "https://form.undip.ac.id/makanansehat/pendaftaran",
            })
          }
        >
          <Link2Icon className="w-4 h-4 mr-2" />
          Goto Undip Food Truk
        </Button>
        <Button
          className="w-full"
          variant={"secondary"}
          onClick={() =>
            chrome.tabs.create({
              url: "https://time.is/",
            })
          }
        >
          <TimerIcon className="w-4 h-4 mr-2" />
          Time.is {"{More Accurate time}"}
        </Button>
        <Button
          className="w-full"
          onClick={() => {
            chrome.tabs.create({ url: "option.html#foodTruk" });
          }}
        >
          Tutorial
        </Button>
      </CardContent>
    </Card>
  );
};

export default AutoFoodTruk;
