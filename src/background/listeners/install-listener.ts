/**
 * Installation and startup event listeners
 */

import { setupAlarmsFromStorage } from "../utils/alarm-manager";
import { restoreSebHeaderRuleFromStorage } from "../features/seb-header";

export function initInstallListener(): void {
  chrome.runtime.onInstalled.addListener(handleInstall);
  chrome.runtime.onStartup.addListener(handleStartup);
}

function handleInstall(details: chrome.runtime.InstalledDetails): void {
  // INIT SiapDips Suspender
  setupAlarmsFromStorage();
  void restoreSebHeaderRuleFromStorage();

  // Context Menus
  chrome.contextMenus.removeAll(() => {
    if (chrome.runtime.lastError) {
      console.debug(
        "[SiapDips] Context menu cleanup skipped:",
        chrome.runtime.lastError.message
      );
    }

    createContextMenuItem({
      id: "suspend-tab",
      title: "💤 Suspend this tab",
      contexts: ["page"],
    });
    createContextMenuItem({
      id: "close-all-suspend-tab",
      title: "😶‍🌫️ Close all suspended tabs",
      contexts: ["page"],
    });
  });

  // On boarding
  if (details.reason === "install") {
    chrome.runtime.openOptionsPage();
  }
}

function createContextMenuItem(
  item: chrome.contextMenus.CreateProperties
): void {
  chrome.contextMenus.create(item, () => {
    if (chrome.runtime.lastError) {
      console.debug(
        "[SiapDips] Context menu create skipped:",
        chrome.runtime.lastError.message
      );
    }
  });
}

function handleStartup(): void {
  setupAlarmsFromStorage();
  void restoreSebHeaderRuleFromStorage();
}
