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
import { initTodoistSync } from "../features/todoist-sync";
import { parseSchedule } from "../features/schedule-parser";

export function initTabUpdateListener(): void {
  chrome.tabs.onUpdated.addListener(handleTabUpdate);
}

function handleTabUpdate(
  tabId: number,
  changeInfo: chrome.tabs.TabChangeInfo,
  tab: chrome.tabs.Tab
): void {
  if (tab.url === undefined) return;

  // LEARN SOCIAL - Toastify injection
  if (
    changeInfo.status === "complete" &&
    tab.url.includes("https://undip.learnsocial.online/")
  ) {
    injectToastify(tabId, false);
  }

  // JADWAL - Schedule parsing
  if (
    changeInfo.status === "complete" &&
    tab.url.includes("https://siap.undip.ac.id/jadwal_mahasiswa/mhs/jadwal/")
  ) {
    parseSchedule(tabId);
  }

  // DARK MODE and related features
  if (
    changeInfo.status === "complete" &&
    tab.url &&
    DARK_MODE_ALLOWED_URLS.some((url) => tab.url?.includes(url))
  ) {
    console.log("BACKGROUND SCRIPT~ for:", tab.url);

    // Inject Toastify (except for certain URLs)
    if (
      !tab.url.includes("https://undip.learnsocial.online/") &&
      !tab.url.includes("https://form.undip.ac.id/")
    ) {
      injectToastify(tabId, true);
    }

    // Apply progress bar fix
    applyProgressBarFix(tabId);

    // Apply custom theme
    applyCustomTheme(tabId);

    // Enable Ctrl+C
    enableCtrlC(tabId, tab.url);

    // Apply privacy blur
    applyPrivacyBlur(tabId, tab.url);

    // Apply custom profile image
    applyCustomProfileImage(tabId);
  }

  // HIDE POPUP on SSO dashboard
  if (tab.url?.includes("https://sso.undip.ac.id/pages/dashboard")) {
    hidePopupIfEnabled(tabId);
  }

  // PBM AUTOMATION
  if (
    changeInfo.status === "loading" &&
    tab.url.includes(
      "https://siap.undip.ac.id/evaluasi_perkuliahan/mhs/evaluasi"
    )
  ) {
    initPBMAutomation(tabId);
  }

  // FOOD TRUCK
  if (
    changeInfo.status === "complete" &&
    tab.url.includes("https://form.undip.ac.id/makanansehat/pendaftaran")
  ) {
    initFoodTruckAutoSelect(tabId);
  }

  // TODOIST SYNC
  if (
    changeInfo.status === "complete" &&
    tab.url.includes("https://kulon2.undip.ac.id/my/")
  ) {
    initTodoistSync(tabId);
  }
}
