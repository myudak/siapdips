console.log("[form-watcher] Content script loaded.");

let pageIsDirty = false;

function monitorFormInputs() {
  const dirtyEvents = ["input", "change", "keydown"];
  const selectors = "input, textarea, select, [contenteditable='true']";

  document.querySelectorAll(selectors).forEach((el) => {
    dirtyEvents.forEach((evt) => {
      el.addEventListener(evt, () => {
        pageIsDirty = true;
      });
    });
  });

  console.log("[form-watcher] Input monitoring started.");
}

// Check timerSuspend before starting form watcher
chrome.storage.local.get("timerSuspend", (result) => {
  if (result.timerSuspend && result.timerSuspend !== "never") {
    monitorFormInputs();
  } else {
    console.log(
      "[form-watcher] Skipping form watcher because suspend is 'never'"
    );
  }
});

// Respond to background script query
chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  console.log("[form-watcher] Message received:", msg);
  if (msg.action === "checkFormDirty") {
    sendResponse({ isDirty: pageIsDirty });
  }
});
