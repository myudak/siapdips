import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { BotMessageSquare, GripHorizontal, HelpCircle } from "lucide-react";
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
                  src="/Vid-Pbm.webm"
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
        <Button className="w-full">
          <BotMessageSquare className="w-4 h-4 mr-2" />
          ~Auto This~
        </Button>
      </CardContent>
    </Card>
  );
};

export default AutoLearnSocial;
