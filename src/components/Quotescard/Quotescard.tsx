import { Card, CardContent } from "@/components/ui/card";
import { GripHorizontal, Quote } from "lucide-react";
import { useState } from "react";
import { quotes } from "./Quotescard.constant";
import { DraggableAttributes } from "@dnd-kit/core";
import { SyntheticListenerMap } from "@dnd-kit/core/dist/hooks/utilities";
import { Button } from "../ui/button";

const QuoteCard = ({
  listeners,
  attributes,
}: {
  listeners?: DraggableAttributes;
  attributes?: SyntheticListenerMap;
}) => {
  const [currentQuoteIndex, setCurrentQuoteIndex] = useState(
    Math.floor(Math.random() * quotes.length)
  );

  const randomizeQuote = () => {
    let newIndex;
    do {
      newIndex = Math.floor(Math.random() * quotes.length);
    } while (newIndex === currentQuoteIndex);
    setCurrentQuoteIndex(newIndex);
  };

  return (
    <Card className="w-full dark:bg-gray-800 dark:border-gray-700 ">
      <Button
        variant="ghost"
        size="icon"
        className="w-full h-8 rounded-b-none border border-b-0 dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700"
        {...attributes}
        {...listeners}
      >
        <GripHorizontal className="h-4 w-4" />
      </Button>
      <CardContent
        className="p-6 relative hover:cursor-pointer"
        onClick={randomizeQuote}
      >
        <Quote className="w-12 h-12 opacity-20 absolute top-4 left-4" />
        <div className="space-y-4">
          <p className="text-xl font-semibold leading-relaxed text-center pt-8 px-8">
            "{quotes[currentQuoteIndex].text}"
          </p>
          <p className="text-lg text-center italic opacity-90">
            - {quotes[currentQuoteIndex].author}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default QuoteCard;
