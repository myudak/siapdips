/**
 * Hide popup functionality for SSO dashboard
 */

export function hidePopupIfEnabled(tabId: number): void {
  chrome.storage.local.get("hidePopup", (data: { hidePopup?: boolean }) => {
    if (data.hidePopup) {
      chrome.scripting.executeScript({
        target: { tabId },
        func: hidePopupScript,
      });
    }
  });
}

function hidePopupScript(): void {
  console.log("HIDE POPP UP");
  const popupElement =
    document.querySelector<HTMLDivElement>(".swal2-container");
  if (popupElement) {
    popupElement.style.display = "none";
    document.body.style.overflow = "auto";
  }
}
