/**
 * Dark mode and custom theme functionality
 */

export function applyProgressBarFix(tabId: number): void {
  chrome.scripting.executeScript({
    target: { tabId },
    func: () => {
      const progressBar = document.querySelectorAll(
        ".progress-bar"
      ) as NodeListOf<HTMLElement>;
      if (progressBar.length > 0) {
        progressBar.forEach((e) => {
          e.style.width = "100%";
        });
      }
    },
  });
}

export function applyCustomTheme(tabId: number): void {
  chrome.storage.local.get("undipCustomTheme", (data) => {
    if (!data.undipCustomTheme || data.undipCustomTheme === "no") return;
    console.log(data);
    chrome.scripting
      .insertCSS({
        files: ["mode.min.css"],
        target: { tabId },
      })
      .catch((error: unknown) => {
        console.error("Failed to inject CSS:", error);
      });

    chrome.storage.local.get("undipCustomThemeValue", (value) => {
      console.log("value", value);
      if (!value.undipCustomThemeValue) return;
      chrome.scripting.executeScript({
        target: { tabId },
        args: [value.undipCustomThemeValue],
        func: (value) => {
          document.documentElement.classList.add(`${value}-theme`);
        },
      });
    });
  });
}
