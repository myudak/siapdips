/**
 * Toastify library injection utilities
 */

/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-ts-comment */
declare const Toastify: any;

export async function injectToastify(
  tabId: number,
  showWelcome: boolean = false
): Promise<void> {
  try {
    await Promise.all([
      chrome.scripting.executeScript({
        target: { tabId },
        files: ["libs/toastify.js"],
      }),
      chrome.scripting.insertCSS({
        target: { tabId },
        files: ["libs/toastify.css"],
      }),
    ]);

    if (showWelcome) {
      chrome.scripting.executeScript({
        target: { tabId },
        func: () => {
          // @ts-ignore
          if (typeof Toastify !== "undefined") {
            // @ts-ignore
            Toastify({
              text: "SiAp DiPS ~> Welcome ヽ（≧□≦）ノ",
              duration: 3000,
              close: true,
              position: "right",
            }).showToast();
          } else {
            console.error("❌ Toastify is not loaded!");
          }
        },
      });
    }
  } catch (error) {
    console.error("❌ Failed to load Toastify:", error);
  }
}
