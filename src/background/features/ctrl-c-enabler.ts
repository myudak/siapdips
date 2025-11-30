/**
 * Enable Ctrl+C functionality on restricted pages
 */

export function enableCtrlC(tabId: number, url: string): void {
  // Skip for certain URLs
  if (
    url.includes("https://form.undip.ac.id/makanansehat") ||
    url.includes("https://undip.learnsocial.online")
  ) {
    return;
  }

  chrome.storage.local.get(
    "disableCtrlC",
    (data: { disableCtrlC?: boolean }) => {
      if (data.disableCtrlC === true) {
        chrome.scripting.executeScript({
          target: { tabId },
          func: disableCtrlCScript,
        });
      }
      if (data.disableCtrlC === undefined) {
        chrome.storage.local.set({ disableCtrlC: true });
        chrome.scripting.executeScript({
          target: { tabId },
          func: disableCtrlCScript,
        });
      }
    }
  );
}

function disableCtrlCScript(): void {
  (function () {
    const unblockActions = () => {
      // Stop custom handlers for Ctrl+C
      document.addEventListener(
        "keydown",
        (event) => {
          if ((event.ctrlKey || event.metaKey) && event.key === "c") {
            event.stopPropagation();
            console.log("Ctrl+C is unblocked.");
          }
        },
        true
      );

      document.addEventListener(
        "keyup",
        (event) => {
          if ((event.ctrlKey || event.metaKey) && event.key === "c") {
            event.stopPropagation();
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
          e.stopPropagation();
        },
        true
      );

      console.log("All custom Ctrl+C behaviors are disabled.");
    };

    unblockActions();

    const observer = new MutationObserver(unblockActions);
    observer.observe(document, { childList: true, subtree: true });
  })();
}
