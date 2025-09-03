import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { GripHorizontal, HelpCircle, SettingsIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { DraggableAttributes } from "@dnd-kit/core";
import { SyntheticListenerMap } from "@dnd-kit/core/dist/hooks/utilities";
import { Button } from "../ui/button";
import { getActiveTab } from "@/lib/utils";

const HidePopupcard = ({
  listeners,
  attributes,
}: {
  listeners?: DraggableAttributes;
  attributes?: SyntheticListenerMap;
}) => {
  const [hidePopup, setHidePopup] = useState(false);
  const [enableCopy, setEnableCopy] = useState(false);
  const [blurDosenWali, setBlurDosenWali] = useState(false);

  useEffect(() => {
    (async () => {
      const {
        hidePopup,
        disableCtrlC = true,
        isBlurredDosenWali,
      } = await chrome.storage.local.get([
        "hidePopup",
        "disableCtrlC",
        "isBlurredDosenWali",
      ]);

      chrome.storage.local.set({ disableCtrlC });
      setEnableCopy(disableCtrlC);

      if (hidePopup !== undefined) setHidePopup(hidePopup);
      if (isBlurredDosenWali !== undefined) {
        console.log("isBlurredDosenWali", isBlurredDosenWali);
        setBlurDosenWali(isBlurredDosenWali);
      }
    })();
  }, []);

  const onclick = async () => {
    chrome.storage.local.set({ hidePopup: !hidePopup });
    const [tab] = await chrome.tabs.query({
      active: true,
      currentWindow: true,
    });
    if (
      !hidePopup ||
      !tab.url?.includes("https://sso.undip.ac.id/pages/dashboard")
    )
      return;
    chrome.scripting.executeScript({
      target: { tabId: tab.id! },
      func: () => {
        console.log("HIDE POPP UP");
        const popupElement = document.querySelector(
          ".swal2-container"
        ) as HTMLElement;
        if (popupElement) {
          popupElement.style.display = "none";
          document.body.style.overflow = "auto"; // Fix scrolling issue
        }
      },
    });
  };

  const onclickCopy = async () => {
    chrome.storage.local.set({ disableCtrlC: !enableCopy });
    if (!enableCopy) {
      let [tab] = await chrome.tabs.query({
        active: true,
        currentWindow: true,
      });
      chrome.scripting.executeScript({
        target: { tabId: tab.id! },
        func: enableCtrlC,
      });
    } else {
      // let [tab] = await chrome.tabs.query({
      //   active: true,
      //   currentWindow: true,
      // });
      // chrome.scripting.executeScript({
      //   target: { tabId: tab.id! },
      //   func: disableCtrlC,
      // });
    }
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
      <CardContent className="flex flex-col  p-0">
        <div className="flex items-center m-4 p-0">
          <Switch
            checked={hidePopup}
            onCheckedChange={() => {
              onclick();
              setHidePopup(!hidePopup);
            }}
            id="hide-popup"
          />
          <Label
            htmlFor="hide-popup"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 ml-2"
          >
            Hide pop up SSO
          </Label>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <HelpCircle className="h-4 w-4 text-muted-foreground cursor-help ml-2" />
              </TooltipTrigger>
              <TooltipContent>
                berlaku di https://sso.undip.ac.id/pages/dashboard
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <div className="flex items-center m-4 p-0">
          <Switch
            checked={enableCopy}
            onCheckedChange={() => {
              onclickCopy();
              setEnableCopy(!enableCopy);
            }}
            id="hide-popup"
          />
          <Label
            htmlFor="hide-popup"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 ml-2"
          >
            Enable klik kanan Copy
          </Label>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <HelpCircle className="h-4 w-4 text-muted-foreground cursor-help ml-2" />
              </TooltipTrigger>
              <TooltipContent
                onClick={() =>
                  chrome.tabs.create({ url: "option.html#EnableClickKanan" })
                }
                title="Tutorial Enable klikakan"
              >
                <video
                  src="/video/Vid-Klikkanan.mp4"
                  autoPlay
                  loop
                  muted
                  className="max-w-xs cursor-pointer"
                />
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <div className="flex items-center m-4 p-0">
          <Switch
            checked={blurDosenWali}
            onCheckedChange={() => {
              (async () => {
                if (!blurDosenWali) {
                  const tabId = await getActiveTab();
                  chrome.scripting.executeScript({
                    target: { tabId: tabId },
                    func: () => {
                      const blurElements = [
                        "#tabmhs_dashboard > div.row > div.col-md-8 > div > div.card-body.pt-0 > div.mb-2 > div",
                      ];

                      blurElements.forEach((selector) => {
                        const element = document.querySelector(selector);
                        if (element) {
                          (element as HTMLElement).style.filter = "blur(5px)";
                        }
                      });
                    },
                  });
                } else {
                  const tabId = await getActiveTab();
                  chrome.scripting.executeScript({
                    target: { tabId: tabId },
                    func: () => {
                      const blurElements = [
                        "#tabmhs_dashboard > div.row > div.col-md-8 > div > div.card-body.pt-0 > div.mb-2 > div",
                      ];

                      blurElements.forEach((selector) => {
                        const element = document.querySelector(selector);
                        if (element) {
                          (element as HTMLElement).style.filter = "none";
                        }
                      });
                    },
                  });
                }
                await chrome.storage.local.set({
                  isBlurredDosenWali: !blurDosenWali,
                });
              })();

              setBlurDosenWali(!blurDosenWali);
            }}
            id="hide-popup"
          />
          <Label
            htmlFor="hide-popup"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 ml-2"
          >
            Blur Dosen Wali
          </Label>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <HelpCircle className="h-4 w-4 text-muted-foreground cursor-help ml-2" />
              </TooltipTrigger>
              <TooltipContent>
                berlaku di https://sso.undip.ac.id/pages/dashboard
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        <Button
          className="m-4 p-0"
          onClick={() => {
            chrome.tabs.create({
              url: chrome.runtime.getURL("option.html#sect1"),
            });
          }}
        >
          <SettingsIcon className="w-4 h-4 mr-2" />
          Advanced Settings
        </Button>
      </CardContent>
    </Card>
  );
};

export default HidePopupcard;

function enableCtrlC() {
  (function () {
    const unblockActions = () => {
      // Stop custom handlers for Ctrl+C
      document.addEventListener(
        "keydown",
        (event) => {
          if ((event.ctrlKey || event.metaKey) && event.key === "c") {
            event.stopPropagation(); // Stop any custom behavior
            console.log("Ctrl+C is unblocked.");
          }
        },
        true
      );

      document.addEventListener(
        "keyup",
        (event) => {
          if ((event.ctrlKey || event.metaKey) && event.key === "c") {
            event.stopPropagation(); // Stop any custom behavior
            console.log("Ctrl+C is unblocked.");
          }
        },
        true
      );

      // Remove all custom event listeners for key events
      const originalAddEventListener = Element.prototype.addEventListener;
      Element.prototype.addEventListener = function (
        type: string,
        listener: any,
        options: any
      ) {
        if (type === "keydown" || type === "keyup") {
          console.warn(`Blocked ${type} listener for Ctrl+C.`);
          return;
        }
        originalAddEventListener.call(this, type, listener, options);
      };

      // Clear any inline `onkeydown` or `onkeyup` handlers
      const elements = document.querySelectorAll("*");
      elements.forEach((el) => {
        // @ts-ignore
        el.onkeydown = null;
        // @ts-ignore
        el.onkeyup = null;
      });

      document.oncontextmenu = null;

      document.addEventListener(
        "contextmenu",
        function (e) {
          e.stopPropagation(); // Stop other listeners from running
        },
        true // Use the capture phase
      );

      function enableContextMenu(aggressive = false) {
        void (document.ondragstart = null);
        void (document.onselectstart = null);
        void (document.onclick = null);
        void (document.onmousedown = null);
        void (document.onmouseup = null);
        void (document.body.oncontextmenu = null);
        enableRightClickLight(document);
        if (aggressive) {
          enableRightClick(document);
          removeContextMenuOnAll("body");
          removeContextMenuOnAll("img");
          removeContextMenuOnAll("td");
        }
      }

      function removeContextMenuOnAll(tagName: string) {
        var elements = document.getElementsByTagName(tagName);
        for (var i = 0; i < elements.length; i++) {
          enableRightClick(elements[i]);
        }
      }

      function enableRightClickLight(el: Document) {
        el || (el = document);
        el.addEventListener("contextmenu", bringBackDefault, true);
      }

      function enableRightClick(el: Document | Element) {
        el || (el = document);
        el.addEventListener("contextmenu", bringBackDefault, true);
        el.addEventListener("dragstart", bringBackDefault, true);
        el.addEventListener("selectstart", bringBackDefault, true);
        el.addEventListener("click", bringBackDefault, true);
        el.addEventListener("mousedown", bringBackDefault, true);
        el.addEventListener("mouseup", bringBackDefault, true);
      }

      // function restoreRightClick(el: Document) {
      //   el || (el = document);
      //   el.removeEventListener("contextmenu", bringBackDefault, true);
      //   el.removeEventListener("dragstart", bringBackDefault, true);
      //   el.removeEventListener("selectstart", bringBackDefault, true);
      //   el.removeEventListener("click", bringBackDefault, true);
      //   el.removeEventListener("mousedown", bringBackDefault, true);
      //   el.removeEventListener("mouseup", bringBackDefault, true);
      // }
      function bringBackDefault(event: any) {
        event.returnValue = true;
        typeof event.stopPropagation === "function" && event.stopPropagation();
        typeof event.cancelBubble === "function" && event.cancelBubble();
      }
      // wlowole bisa
      enableContextMenu();

      console.log("All custom Ctrl+C behaviors are disabled.");
    };

    // Run unblock function
    unblockActions();

    // Observe DOM changes and re-apply if necessary
    const observer = new MutationObserver(unblockActions);
    observer.observe(document, { childList: true, subtree: true });

    // @ts-ignore
    Toastify({
      text: "SiAp DiPS ~> Enable Klik kanan",
      duration: 1000,
      close: true,
      gravity: "top",
      position: "left",
    }).showToast();
  })();
}

// function disableCtrlC() {
//   (() => {
//     // Restore MutationObserver
//     MutationObserver.prototype.observe = function () {
//       console.log("MutationObserver disabled.");
//     };

//     // Restore addEventListener
//     // @ts-ignore
//     delete Element.prototype.addEventListener;

//     // Remove key event listeners
//     // @ts-ignore
//     document.removeEventListener("keydown", null, true);
//     // @ts-ignore
//     document.removeEventListener("keyup", null, true);

//     // Clear inline handlers
//     document.querySelectorAll("*").forEach((el) => {
//       // @ts-ignore
//       el.onkeydown = null;
//       // @ts-ignore
//       el.onkeyup = null;
//     });

//     console.log("Custom unblock behaviors have been disabled.");
//   })();
// }
