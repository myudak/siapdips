/**
 * SiapDips Background Script
 * Main entry point that wires all modules together
 */

console.log("myudak lagi cooking...");

// Import utilities
import { setupAlarmsFromStorage, initAlarmListeners } from "./background/utils/alarm-manager";

// Import listeners
import { initInstallListener } from "./background/listeners/install-listener";
import { initTabUpdateListener } from "./background/listeners/tab-update-listener";
import { initAlarmListener } from "./background/listeners/alarm-listener";
import { initContextMenuListener } from "./background/listeners/context-menu-listener";
import { initMessageListener } from "./background/listeners/message-listener";
import { restoreSebHeaderRuleFromStorage } from "./background/features/seb-header";

// Initialize SiapDips Suspender
setupAlarmsFromStorage();

// Initialize alarm storage listeners
initAlarmListeners();

// Initialize all event listeners
initInstallListener();
initTabUpdateListener();
initAlarmListener();
initContextMenuListener();
initMessageListener();

// Restore persisted dynamic features that need runtime reattachment.
void restoreSebHeaderRuleFromStorage();
