import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import NavButton from "./Navcard.button";
import { DraggableAttributes } from "@dnd-kit/core";
import { SyntheticListenerMap } from "@dnd-kit/core/dist/hooks/utilities";
import { GripHorizontal } from "lucide-react";
import { Button } from "../ui/button";
import { useEffect, useState } from "react";
import {
  DraggableButton,
  DraggableButtonSerialized,
  EXCLUDED_AWAL,
  ICON_MAP,
  INCLUDED_AWAL,
  INCLUDED_AWAL_SERIALIZABLE,
} from "./Navcard.constant";

const NavigationCard = ({
  listeners,
  attributes,
}: {
  listeners?: DraggableAttributes;
  attributes?: SyntheticListenerMap;
}) => {
  const [linkNav, setLinkNav] = useState<DraggableButton[] | "">("");

  useEffect(() => {
    chrome.storage.local.get(
      ["includedNavCard", "excludedNavCard"],
      (result: {
        includedNavCard?: DraggableButtonSerialized[];
        excludedNavCard?: DraggableButtonSerialized[];
      }) => {
        if (
          result.includedNavCard &&
          result.excludedNavCard &&
          result.includedNavCard.length + result.excludedNavCard.length ===
            INCLUDED_AWAL.length + EXCLUDED_AWAL.length
        ) {
          setLinkNav(
            result.includedNavCard.map(({ iconName, ...rest }) => ({
              ...rest,
              icon: ICON_MAP[iconName],
            }))
          );
          return;
        }
        setLinkNav(INCLUDED_AWAL);
        chrome.storage.local.set({
          includedNavCard: INCLUDED_AWAL_SERIALIZABLE,
        });
      }
    );
  }, []);
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
        <CardTitle className="text-lg font-bold">Quick Access</CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-3 gap-1 p-2">
        {linkNav !== "" &&
          linkNav.map((link, index) => <NavButton key={index} {...link} />)}
      </CardContent>
    </Card>
  );
};

export default NavigationCard;
