import { useState } from "react";
import { Heart, Coffee, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export default function SupportProjectButton() {
  const trakteerUrl = "https://trakteer.id/myudak/tip";
  const [isHovered, setIsHovered] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className={`
                relative overflow-hidden
                transform transition-all duration-300 ease-out
                hover:scale-110 hover:bg-red-50 dark:hover:bg-red-950
                active:scale-95
                animate-pulse
                before:content-[''] before:absolute before:inset-0 
                before:rounded-full before:border-2 before:border-red-200 
                dark:before:border-red-800 before:scale-100
                before:animate-ping before:opacity-75
              `}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          style={{
            animation: isHovered
              ? "none"
              : "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
          }}
        >
          <Heart
            className={`w-6 h-6 transition-all duration-300 relative z-10 ${
              isHovered
                ? "text-red-500 fill-red-500 animate-bounce"
                : "text-gray-600 dark:text-gray-400"
            }`}
          />
          <span className="sr-only">Support this project</span>
        </Button>
      </DialogTrigger>

      <DialogContent className=" ">
        <DialogHeader className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 bg-red-50 dark:bg-red-950 rounded-full flex items-center justify-center">
            <Heart className="w-8 h-8 text-red-500 fill-red-500" />
          </div>
          <DialogTitle className="text-2xl font-bold text-gray-900 dark:text-white">
            Support Our Work ( •̀ ω •́ )✧
          </DialogTitle>
          <DialogDescription className="text-base text-left text-gray-700 dark:text-gray-300">
            Thanks for using our <strong>Job Application Tracker</strong>! We're
            glad it's helping with your job search journey! ヾ(≧ ▽ ≦)ゝ
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
            If you're finding this tool valuable, your support would help us
            continue improving:
          </p>

          <ul className="space-y-3 text-sm text-gray-700 dark:text-gray-300">
            <li className="flex items-start space-x-3">
              <span className="text-lg">🚫</span>
              <span>Keep the extension completely ad-free</span>
            </li>
            <li className="flex items-start space-x-3">
              <span className="text-lg">🚀</span>
              <span>Develop exciting new features (coming soon!)</span>
            </li>
          </ul>

          {/* Trakteer Card */}
          <a href={trakteerUrl} className="block" target="_blank">
            <div className="bg-secondary hover:bg-secondary/80  rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-orange-500 dark:bg-orange-600 rounded-lg flex items-center justify-center">
                    <Coffee className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white text-sm">
                      Trakteer
                    </p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      Buy me a coffee
                    </p>
                  </div>
                </div>
                <ExternalLink className="w-4 h-4 text-gray-400 dark:text-gray-500" />
              </div>
            </div>
          </a>
        </div>

        <DialogFooter className="flex-col sm:flex-row gap-2">
          <Button
            variant="outline"
            className="w-full sm:w-auto border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
            onClick={() => setIsOpen(false)}
          >
            Maybe Later
          </Button>
          <Button
            asChild
            className="w-full sm:w-auto bg-red-500 hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-700 text-white"
          >
            <a
              href={trakteerUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center space-x-2"
            >
              <Coffee className="w-4 h-4" />
              <span>Support on Trakteer</span>
            </a>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
