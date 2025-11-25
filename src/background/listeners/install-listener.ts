/**
 * Installation and startup event listeners
 */

import { setupAlarmsFromStorage } from "../utils/alarm-manager";

export function initInstallListener(): void {
  chrome.runtime.onInstalled.addListener(handleInstall);
  chrome.runtime.onStartup.addListener(handleStartup);
}

function handleInstall(details: chrome.runtime.InstalledDetails): void {
  // INIT SiapDips Suspender
  setupAlarmsFromStorage();

  // Context Menus
  chrome.contextMenus.create({
    id: "suspend-tab",
    title: "💤 Suspend this tab",
    contexts: ["page"],
  });
  chrome.contextMenus.create({
    id: "close-all-suspend-tab",
    title: "😶‍🌫️ Close all suspended tabs",
    contexts: ["page"],
  });

  // On boarding
  if (details.reason === "install") {
    chrome.runtime.openOptionsPage();
  }
}

function handleStartup(): void {
  setupAlarmsFromStorage();
}
