import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import {
  BotMessageSquare,
  GripHorizontal,
  HelpCircle,
  Link2Icon,
  LinkIcon,
} from "lucide-react";
import { Button } from "../ui/button";
import { DraggableAttributes } from "@dnd-kit/core";
import { SyntheticListenerMap } from "@dnd-kit/core/dist/hooks/utilities";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";

const AutoLearnSocial = ({
  listeners,
  attributes,
}: {
  listeners?: DraggableAttributes;
  attributes?: SyntheticListenerMap;
}) => {
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
      <CardHeader className="py-2">
        <CardTitle className="text-lg font-bold">
          Auto Learn Social {"{Helper}"}
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
                  src="/video/vid-learnsocial.mp4"
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
        <Button
          className="w-full"
          onClick={async () => {
            const [tab] = await chrome.tabs.query({
              active: true,
              currentWindow: true,
            });
            if (!tab?.id) return;
            if (!tab.url?.includes("https://undip.learnsocial.online")) {
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
                  // @ts-ignore
                  Toastify({
                    text: "Siap DIps ~~> BUKAN LEARNSOCIAL `(*>﹏<*)′",
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
              files: ["content-undiplearn.js"],
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
              url: "https://github.com/myudak/learnSocial-hack",
            })
          }
        >
          <LinkIcon className="w-4 h-4 mr-2" />
          Learn Social "hack" {"<Old Version>"}
        </Button>
        <Button
          className="w-full"
          variant={"secondary"}
          onClick={() =>
            chrome.tabs.create({
              url: "https://undip.learnsocial.online",
            })
          }
        >
          <Link2Icon className="w-4 h-4 mr-2" />
          Goto Undip Learn Social
        </Button>
        <Button
          className="w-full"
          onClick={() => {
            chrome.tabs.create({ url: "option.html#autolearnsocial" });
          }}
        >
          Tutorial
        </Button>
      </CardContent>
    </Card>
  );
};

export default AutoLearnSocial;
