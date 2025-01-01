console.log("myudak lagi cooking...");

const darkModeAllowedUrls: string[] = [
  "https://siap.undip.ac.id/",
  "https://sso.undip.ac.id/",
  "https://kulon2.undip.ac.id/",
];

// Listen to tab updates
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (tab.url === undefined) return;

  // DARK MODE
  if (
    changeInfo.status === "complete" &&
    tab.url &&
    darkModeAllowedUrls.some((url) => tab.url?.includes(url))
  ) {
    chrome.storage.local.get("undipCustomTheme", (data) => {
      if (!data.undipCustomTheme || data.undipCustomTheme === "no") return;
      console.log(data);
      chrome.scripting
        .insertCSS({
          files: ["mode.css"],
          target: { tabId: tab.id! },
        })
        .catch((error: unknown) => {
          console.error("Failed to inject CSS:", error);
        });

      chrome.storage.local.get("undipCustomThemeValue", (value) => {
        console.log("value", value);
        if (!value.undipCustomThemeValue) return;
        chrome.scripting.executeScript({
          target: { tabId: tab.id! },
          args: [value.undipCustomThemeValue],
          func: (value) => {
            document.documentElement.classList.add(`${value}-theme`);
          },
        });
      });
    });
  }

  // HIDE POP UP
  if (tab.url?.includes("https://sso.undip.ac.id/pages/dashboard")) {
    chrome.storage.local.get("hidePopup", (data: { hidePopup?: boolean }) => {
      if (data.hidePopup) {
        chrome.scripting.executeScript({
          target: { tabId: tab.id! },
          func: hidePopup,
        });
      }
    });
  }
});

// Hide popup function
function hidePopup(): void {
  console.log("HIDE POPP UP");
  const popupElement =
    document.querySelector<HTMLDivElement>(".swal2-container");
  if (popupElement) {
    popupElement.style.display = "none";
    document.body.style.overflow = "auto"; // Fix scrolling issue
  }
}
