/**
 * Context menu event listener
 */

import { closeAllSuspendedTabs } from "../utils/tab-suspender";

export function initContextMenuListener(): void {
  chrome.contextMenus.onClicked.addListener(handleContextMenuClick);
}

function handleContextMenuClick(
  info: chrome.contextMenus.OnClickData,
  tab?: chrome.tabs.Tab
): void {
  if (
    info.menuItemId === "suspend-tab" &&
    tab?.id &&
    tab.url?.startsWith("http")
  ) {
    const encodedUrl = encodeURIComponent(tab.url);
    const encodedTitle = encodeURIComponent(tab.title ?? "Sleeping Tab");
    const encodedFavicon = encodeURIComponent(tab.favIconUrl ?? "");

    const suspendUrl =
      chrome.runtime.getURL("suspended.html") +
      `#url=${encodedUrl}&title=${encodedTitle}&favicon=${encodedFavicon}`;

    chrome.tabs.update(tab.id, { url: suspendUrl });
  }

  if (info.menuItemId === "close-all-suspend-tab") {
    closeAllSuspendedTabs();
  }
}
