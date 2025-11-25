/**
 * Alarm event listener
 */

import {
  TabSuspenderAlarm,
  closeSuspendedTabsAlarm,
  AutoCloseTabsAlarm,
} from "../utils/tab-suspender";

export function initAlarmListener(): void {
  chrome.alarms.onAlarm.addListener(handleAlarm);
}

async function handleAlarm(alarm: chrome.alarms.Alarm): Promise<void> {
  switch (alarm.name) {
    case "checkTabs":
      await TabSuspenderAlarm();
      break;
    case "closeSuspendedTabs":
      await closeSuspendedTabsAlarm();
      break;
    case "autoCloseTabs":
      await AutoCloseTabsAlarm();
      break;
  }
}
