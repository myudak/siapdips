/**
 * Alarm management for tab suspension and auto-close features
 */

import { CHECK_INTERVAL_MINUTES } from "../config/constants";
import { suspendTimeToMinutes } from "./time-converter";

export function setupAlarmsFromStorage(): void {
  chrome.alarms.clearAll();

  chrome.storage.local.get(
    ["timerSuspend", "timerAutoCloseSuspend", "timerAutoCloseTabs"],
    (result) => {
      if (result.timerSuspend && result.timerSuspend !== "never") {
        chrome.alarms.create("checkTabs", {
          periodInMinutes: CHECK_INTERVAL_MINUTES,
        });
      }

      if (
        result.timerAutoCloseSuspend &&
        result.timerAutoCloseSuspend !== "never"
      ) {
        const autoCloseMinutes = suspendTimeToMinutes(
          result.timerAutoCloseSuspend
        );
        if (autoCloseMinutes) {
          chrome.alarms.create("closeSuspendedTabs", {
            periodInMinutes: autoCloseMinutes,
          });
        }
      }

      if (result.timerAutoCloseTabs && result.timerAutoCloseTabs !== "never") {
        chrome.alarms.create("autoCloseTabs", {
          periodInMinutes: CHECK_INTERVAL_MINUTES,
        });
      }
    }
  );
}

export function initAlarmListeners(): void {
  // React to setting changes
  chrome.storage.onChanged.addListener((changes, area) => {
    if (area === "local") {
      if (
        changes.timerSuspend ||
        changes.timerAutoCloseSuspend ||
        changes.timerAutoCloseTabs
      ) {
        setupAlarmsFromStorage();
      }
    }
  });
}
