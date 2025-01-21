import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import NavButton from "./Navcard.button";
import { navLinks } from "./Navcard.constant";
import { DraggableAttributes } from "@dnd-kit/core";
import { SyntheticListenerMap } from "@dnd-kit/core/dist/hooks/utilities";
import { GripHorizontal } from "lucide-react";
import { Button } from "../ui/button";

const NavigationCard = ({
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
        <CardTitle className="text-lg font-bold">Quick Access</CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-3 gap-1 p-2">
        {navLinks.map((link, index) => (
          <NavButton key={index} {...link} />
        ))}
      </CardContent>
    </Card>
  );
};

export default NavigationCard;
