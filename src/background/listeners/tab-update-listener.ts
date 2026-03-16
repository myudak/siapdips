/**
 * Tab update listener coordinator
 * Delegates tab update events to appropriate feature modules
 */

import { DARK_MODE_ALLOWED_URLS } from "../config/constants";
import { injectToastify } from "../features/toastify-injector";
import { applyProgressBarFix, applyCustomTheme } from "../features/dark-mode";
import { enableCtrlC } from "../features/ctrl-c-enabler";
import { applyPrivacyBlur } from "../features/privacy-blur";
import { applyCustomProfileImage } from "../features/profile-customizer";
import { hidePopupIfEnabled } from "../features/popup-hider";
import { initPBMAutomation } from "../features/pbm-automation";
import { initFoodTruckAutoSelect } from "../features/food-truck";
import {
  isTodoistSyncConfigured,
  refreshKulonAssignmentsCacheFromTab,
  shouldProcessKulonVisit,
} from "../features/kulon-assignments";
import { runTodoistSyncForTab } from "../features/todoist-sync";
import { parseSchedule } from "../features/schedule-parser";
import { initHackerRankCopyQuestion } from "../features/hackerrank-copy-question";

export function initTabUpdateListener(): void {
  chrome.tabs.onUpdated.addListener(handleTabUpdate);
}

function handleTabUpdate(
  tabId: number,
  changeInfo: chrome.tabs.TabChangeInfo,
  tab: chrome.tabs.Tab
): void {
  const currentUrl = changeInfo.url ?? tab.url;
  if (!currentUrl) return;

  // HACKERRANK - Copy question button on contest challenge pages
  if (changeInfo.status === "complete" || Boolean(changeInfo.url)) {
    initHackerRankCopyQuestion(tabId, currentUrl);
  }

  // LEARN SOCIAL - Toastify injection
  if (
    changeInfo.status === "complete" &&
    currentUrl.includes("https://undip.learnsocial.online/")
  ) {
    injectToastify(tabId, false);
  }

  // JADWAL - Schedule parsing
  if (
    changeInfo.status === "complete" &&
    currentUrl.includes("https://siap.undip.ac.id/jadwal_mahasiswa/mhs/jadwal/")
  ) {
    parseSchedule(tabId);
  }

  // DARK MODE and related features
  if (
    changeInfo.status === "complete" &&
    DARK_MODE_ALLOWED_URLS.some((url) => currentUrl.includes(url))
  ) {
    console.log("BACKGROUND SCRIPT~ for:", currentUrl);

    if (
      !currentUrl.includes("https://undip.learnsocial.online/") &&
      !currentUrl.includes("https://form.undip.ac.id/")
    ) {
      injectToastify(tabId, true);
    }

    applyProgressBarFix(tabId);
    applyCustomTheme(tabId);
    enableCtrlC(tabId, currentUrl);
    applyPrivacyBlur(tabId, currentUrl);
    applyCustomProfileImage(tabId);
  }

  if (currentUrl.includes("https://sso.undip.ac.id/pages/dashboard")) {
    hidePopupIfEnabled(tabId);
  }

  if (
    changeInfo.status === "complete" &&
    currentUrl.includes(
      "https://siap.undip.ac.id/evaluasi_perkuliahan/mhs/evaluasi"
    )
  ) {
    console.log("ANJING");
    initPBMAutomation(tabId);
  }

  if (
    changeInfo.status === "complete" &&
    currentUrl.includes("https://form.undip.ac.id/makanansehat/pendaftaran")
  ) {
    initFoodTruckAutoSelect(tabId);
  }

  if (
    changeInfo.status === "complete" &&
    currentUrl.includes("https://kulon2.undip.ac.id/my/")
  ) {
    void handleKulonAssignmentsVisit(tabId);
  }
}

async function handleKulonAssignmentsVisit(tabId: number): Promise<void> {
  const shouldProcess = await shouldProcessKulonVisit();
  if (!shouldProcess) {
    return;
  }

  const assignments = await refreshKulonAssignmentsCacheFromTab(tabId);
  const todoistConfigured = await isTodoistSyncConfigured();

  if (!todoistConfigured) {
    return;
  }

  await runTodoistSyncForTab(tabId, {
    notifyIfUnconfigured: false,
    scrapedAssignments: assignments,
  });
}
