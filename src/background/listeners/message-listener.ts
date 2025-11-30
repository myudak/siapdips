/**
 * Runtime message event listener
 */

import {
  closeAllSuspendedTabs,
  SuspendAllThoseTabsNow,
  CloseThoseTabsNow,
} from "../utils/tab-suspender";

export function initMessageListener(): void {
  chrome.runtime.onMessage.addListener(handleMessage);
}

function handleMessage(message: any): void {
  if (message.type === "closeAllSuspendedTabsNow") {
    closeAllSuspendedTabs();
  }
  if (message.type === "suspendAllTabsNow") {
    SuspendAllThoseTabsNow();
  }
  if (message.type === "closeAllTabsNow") {
    CloseThoseTabsNow();
  }
}
