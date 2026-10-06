/**
 * Dark mode and custom theme functionality
 */

import { execOnPage, execCSSOnPage } from "../utils/execute-script";

export function applyProgressBarFix(tabId: number): void {
  execOnPage(tabId, () => {
    const progressBar = document.querySelectorAll(
      ".progress-bar"
    ) as NodeListOf<HTMLElement>;
    if (progressBar.length > 0) {
      progressBar.forEach((e) => {
        e.style.width = "100%";
      });
    }
  });
}

export function applyCustomTheme(tabId: number): void {
  chrome.storage.local.get("undipCustomTheme", (data) => {
    if (!data.undipCustomTheme || data.undipCustomTheme === "no") return;
    console.log(data);
    execCSSOnPage(tabId, "mode.min.css").catch((error: unknown) => {
      console.error("Failed to inject CSS:", error);
    });

    chrome.storage.local.get("undipCustomThemeValue", (value) => {
      console.log("value", value);
      if (!value.undipCustomThemeValue) return;
      execOnPage(tabId, (themeValue: unknown) => {
        document.documentElement.classList.add(`${themeValue}-theme`);
      }, [value.undipCustomThemeValue]);
    });
  });
}
