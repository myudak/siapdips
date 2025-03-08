import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const NavButton = ({
  icon: Icon,
  title,
  subtitle,
  tooltip,
  href,
}: {
  icon: React.ElementType;
  title: string;
  subtitle: string;
  tooltip: string;
  href: string;
}) => {
  const handleLinkClick = (e: React.MouseEvent) => {
    e.preventDefault();
    chrome.tabs.create({ url: href });
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            className="w-full flex flex-col items-center p-4 h-auto hover:bg-gray-100 dark:hover:bg-gray-600 space-y-1"
            onClick={handleLinkClick}
          >
            <Icon className="h-6 w-6 mb-1" />
            <div className="text-sm font-medium">{title}</div>
            <div className="text-center text-xs text-gray-500 dark:text-gray-400 w-full">
              {subtitle}
            </div>
          </Button>
        </TooltipTrigger>
        <TooltipContent className="max-w-xs break-words overflow-auto">
          <p>{tooltip}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default NavButton;
