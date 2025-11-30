/**
 * Tab suspension functionality
 */

import { suspendTimeToMinutes } from "./time-converter";

export function suspendTab(tab: chrome.tabs.Tab): void {
  const encodedUrl = encodeURIComponent(tab.url ?? "");
  const encodedTitle = encodeURIComponent(tab.title ?? "Sleeping Tab");
  const encodedFavicon = encodeURIComponent(tab.favIconUrl ?? "");

  const suspendUrl =
    chrome.runtime.getURL("suspended.html") +
    `#url=${encodedUrl}&title=${encodedTitle}&favicon=${encodedFavicon}`;

  chrome.tabs.update(tab.id!, { url: suspendUrl });
}

export function closeAllSuspendedTabs(): void {
  chrome.tabs.query({}, (tabs) => {
    for (const tab of tabs) {
      if (
        tab.url?.startsWith("chrome-extension://") ||
        tab.url?.startsWith("moz-extension://")
      ) {
        if (tab.url.includes("suspended.html") && tab.id !== undefined) {
          chrome.tabs.remove(tab.id);
        }
      }
    }
  });
}

export async function TabSuspenderAlarm(): Promise<void> {
  console.log("🔔 Checking tabs for suspension...");

  const result = await new Promise<any>((resolve) =>
    chrome.storage.local.get(
      [
        "timerSuspend",
        "suspendPinnedTabs",
        "suspendUnsavedInputs",
        "suspendActiveTab",
        "suspendAudioTabs",
      ],
      resolve
    )
  );

  if (!result.timerSuspend || result.timerSuspend === "never") {
    console.log("🔔 No suspension timer set. Skipping...");
    return;
  }

  const SUSPEND_AFTER_MINUTES = suspendTimeToMinutes(result.timerSuspend) ?? 30;

  console.log("🔔 Suspend after minutes:", SUSPEND_AFTER_MINUTES);

  chrome.tabs.query({}, (tabs) => {
    tabs.forEach((tab) => {
      const tabId = tab.id;
      if (typeof tabId !== "number") return;

      if (
        !tab.url ||
        !tab.url.startsWith("http") ||
        tab.url.startsWith("chrome://")
      )
        return;

      if ((result.suspendPinnedTabs ?? true) && tab.pinned) return;
      if ((result.suspendActiveTab ?? true) && tab.active) return;
      if ((result.suspendAudioTabs ?? true) && tab.audible) return;

      const lastUsed = tab.lastAccessed ?? Date.now();
      const idleMinutes = (Date.now() - lastUsed) / 60000;

      console.log(
        `🔔 Tab ${tab.url} last accessed ${idleMinutes.toFixed(2)} minutes ago`
      );

      if (idleMinutes < SUSPEND_AFTER_MINUTES) return;

      if (result.suspendUnsavedInputs ?? true) {
        chrome.tabs.sendMessage(tabId, { action: "checkFormDirty" }, (res) => {
          if (chrome.runtime.lastError || res?.isDirty) {
            console.log(`❌ Tab ${tab.url} is dirty or errored. Skipping...`);
            return;
          }
          suspendTab(tab);
        });
      } else {
        suspendTab(tab);
      }
    });
  });
}

export async function SuspendAllThoseTabsNow(): Promise<void> {
  console.log("Suspening all those tabs now...");

  const result = await new Promise<any>((resolve) =>
    chrome.storage.local.get(
      [
        "suspendPinnedTabs",
        "suspendUnsavedInputs",
        "suspendActiveTab",
        "suspendAudioTabs",
      ],
      resolve
    )
  );

  chrome.tabs.query({}, (tabs) => {
    tabs.forEach((tab) => {
      const tabId = tab.id;
      if (typeof tabId !== "number") return;

      if (
        !tab.url ||
        !tab.url.startsWith("http") ||
        tab.url.startsWith("chrome://")
      )
        return;

      if ((result.suspendPinnedTabs ?? true) && tab.pinned) return;
      if ((result.suspendActiveTab ?? true) && tab.active) return;
      if ((result.suspendAudioTabs ?? true) && tab.audible) return;

      const lastUsed = tab.lastAccessed ?? Date.now();
      const idleMinutes = (Date.now() - lastUsed) / 60000;

      console.log(
        `🔔 Tab ${tab.url} last accessed ${idleMinutes.toFixed(2)} minutes ago`
      );

      if (result.suspendUnsavedInputs ?? true) {
        chrome.tabs.sendMessage(tabId, { action: "checkFormDirty" }, (res) => {
          if (chrome.runtime.lastError || res?.isDirty) {
            console.log(`❌ Tab ${tab.url} is dirty or errored. Skipping...`);
            return;
          }
          suspendTab(tab);
        });
      } else {
        suspendTab(tab);
      }
    });
  });
}

export async function closeSuspendedTabsAlarm(): Promise<void> {
  const result = await new Promise<any>((resolve) =>
    chrome.storage.local.get(["timerAutoCloseSuspend"], resolve)
  );
  if (
    !result.timerAutoCloseSuspend ||
    result.timerAutoCloseSuspend === "never"
  ) {
    console.log("🔔 No suspension timer set. Skipping...");
    return;
  }

  console.log("🔔 Closing all suspended tabs...");
  closeAllSuspendedTabs();
}

export async function AutoCloseTabsAlarm(): Promise<void> {
  const result = await new Promise<any>((resolve) =>
    chrome.storage.local.get(
      [
        "timerAutoCloseTabs",
        "closePinnedTabs",
        "closeUnsavedInputs",
        "closeActiveTab",
        "closeAudioTabs",
      ],
      resolve
    )
  );

  if (!result.timerAutoCloseTabs || result.timerAutoCloseTabs === "never") {
    console.log("🔔 No auto tab close timer set. Skipping...");
    return;
  }
  console.log("🔔 Checking closing idle tabs...");

  const AUTO_CLOSE_MINUTES =
    suspendTimeToMinutes(result.timerAutoCloseTabs) ?? 30;
  chrome.tabs.query({}, (tabs) => {
    for (const tab of tabs) {
      const tabId = tab.id;
      if (typeof tabId !== "number") continue;

      if (
        !tab.url ||
        !tab.url.startsWith("http") ||
        tab.url.startsWith("chrome://")
      )
        continue;

      if ((result.closePinnedTabs ?? true) && tab.pinned) continue;
      if ((result.closeActiveTab ?? true) && tab.active) continue;
      if ((result.closeAudioTabs ?? true) && tab.audible) continue;

      console.log("🔔 Tab is eligible for auto close:", tab.url);

      const lastUsed = tab.lastAccessed ?? Date.now();
      const idleMinutes = (Date.now() - lastUsed) / 60000;

      console.log(
        `🔔 Tab ${tab.url} last accessed ${idleMinutes.toFixed(2)} minutes ago`
      );

      if (idleMinutes < AUTO_CLOSE_MINUTES) continue;

      if (result.closeUnsavedInputs ?? true) {
        chrome.tabs.sendMessage(tabId, { action: "checkFormDirty" }, (res) => {
          if (chrome.runtime.lastError || res?.isDirty) {
            console.log(`❌ Tab ${tab.url} is dirty or errored. Skipping...`);
            return;
          }
          chrome.tabs.remove(tabId, () => {
            console.log(
              `🔔 Closed tab ${tab.url} after ${idleMinutes.toFixed(2)} minutes`
            );
          });
        });
      } else {
        chrome.tabs.remove(tabId, () => {
          console.log(
            `🔔 Closed tab ${tab.url} after ${idleMinutes.toFixed(2)} minutes`
          );
        });
      }
    }
  });
}

export async function CloseThoseTabsNow(): Promise<void> {
  console.log("Closing all those tabs now...");
  const result = await new Promise<any>((resolve) =>
    chrome.storage.local.get(
      [
        "closePinnedTabs",
        "closeUnsavedInputs",
        "closeActiveTab",
        "closeAudioTabs",
      ],
      resolve
    )
  );

  chrome.tabs.query({}, (tabs) => {
    for (const tab of tabs) {
      const tabId = tab.id;
      if (typeof tabId !== "number") continue;

      if (
        !tab.url ||
        !tab.url.startsWith("http") ||
        tab.url.startsWith("chrome://")
      )
        continue;

      if ((result.closePinnedTabs ?? true) && tab.pinned) continue;
      if ((result.closeActiveTab ?? true) && tab.active) continue;
      if ((result.closeAudioTabs ?? true) && tab.audible) continue;

      console.log("🔔 Tab is eligible for auto close:", tab.url);

      const lastUsed = tab.lastAccessed ?? Date.now();
      const idleMinutes = (Date.now() - lastUsed) / 60000;

      console.log(
        `🔔 Tab ${tab.url} last accessed ${idleMinutes.toFixed(2)} minutes ago`
      );

      if (result.closeUnsavedInputs ?? true) {
        chrome.tabs.sendMessage(tabId, { action: "checkFormDirty" }, (res) => {
          if (chrome.runtime.lastError || res?.isDirty) {
            console.log(`❌ Tab ${tab.url} is dirty or errored. Skipping...`);
            return;
          }
          chrome.tabs.remove(tabId, () => {
            console.log(
              `🔔 Closed tab ${tab.url} after ${idleMinutes.toFixed(2)} minutes`
            );
          });
        });
      } else {
        chrome.tabs.remove(tabId, () => {
          console.log(
            `🔔 Closed tab ${tab.url} after ${idleMinutes.toFixed(2)} minutes`
          );
        });
      }
    }
  });
}
