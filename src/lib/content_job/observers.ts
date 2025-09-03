import { isJobPage } from "./utils/page_detection";
import { createTrackerButton, removeTrackerButton } from "./ui/button";

let currentUrl = window.location.href;
let observer: MutationObserver | null = null;

/**
 * Handles the logic for showing or hiding the tracker button based on the page type.
 */
function handlePageChange() {
  if (isJobPage()) {
    // The onClick function will be passed in from the main initializer
    // For now, we just create the button. The event listener will be attached in the main script.
    // This is a placeholder for the actual click handler logic.
    createTrackerButton(() => {
      // This function will be replaced by the actual click handler in index.ts
      console.log("Tracker button clicked. Handler to be implemented.");
    });
  } else {
    removeTrackerButton();
  }
}

/**
 * Starts observing for URL changes and DOM mutations.
 * @param {Function} onUrlChange - The function to call when the URL changes.
 */
export function startObserving(onUrlChange: () => void) {
  // Initial check
  onUrlChange();

  // Observe URL changes (for SPAs)
  setInterval(() => {
    if (currentUrl !== window.location.href) {
      currentUrl = window.location.href;
      onUrlChange();
    }
  }, 500);

  // Observe DOM changes
  observer = new MutationObserver((mutations) => {
    // A simple check to avoid running on every tiny mutation.
    // We can make this more intelligent if needed.
    let significantChange = mutations.some(
      (m) => m.addedNodes.length > 0 || m.removedNodes.length > 0
    );
    if (significantChange) {
      onUrlChange();
    }
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true,
  });
}

/**
 * Stops all observers.
 */
export function stopObserving() {
  if (observer) {
    observer.disconnect();
    observer = null;
  }
  // We might want to clear the interval as well, but it's lightweight.
  // For a more robust solution, we would clear it.
}
