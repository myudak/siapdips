/**
 * Toastify library injection utilities
 *
 * Toastify JS and CSS are now injected via manifest content_scripts on
 * all *.undip.ac.id pages, bypassing CSP entirely. This module just
 * shows the welcome toast. The library injection fallback is kept as
 * a safety net for any pages NOT covered by the manifest entry.
 */

/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  execOnPage,
  execFileOnPage,
  execCSSOnPage,
} from "../utils/execute-script";

declare const Toastify: any;

/**
 * Ensures Toastify is available on the page and optionally shows a welcome
 * toast. Since Toastify is injected via manifest on all undip pages, the
 * execFileOnPage/execCSSOnPage calls are fallbacks only.
 *
 * @param tabId       Target tab ID
 * @param showWelcome Whether to also show a welcome toast after injection
 */
export async function injectToastify(
  tabId: number,
  showWelcome: boolean = false
): Promise<void> {
  // Step 1: Inject JS library if not already on page.
  // (manifest injects it on undip pages, so this is a no-op there)
  try {
    await execFileOnPage(tabId, "libs/toastify.js");
  } catch (jsError) {
    console.error(
      `[SiapDips] Failed to inject Toastify JS for tab ${tabId}:`,
      jsError
    );
    return;
  }

  // Step 2: Inject CSS (also handled by manifest on undip pages).
  try {
    await execCSSOnPage(tabId, "libs/toastify.css");
  } catch (cssError) {
    console.warn(
      `[SiapDips] Failed to inject Toastify CSS for tab ${tabId}:`,
      cssError
    );
  }

  // Step 3: Show welcome toast.
  if (!showWelcome) return;

  try {
    await execOnPage(tabId, () => {
      if (typeof (globalThis as any).Toastify !== "undefined") {
        (globalThis as any).Toastify({
          text: "SiAp DiPS ~> Welcome ヽ（≧□≦）ノ",
          duration: 3000,
          close: true,
          position: "right",
        }).showToast();
      } else {
        console.warn("[SiapDips] Toastify not in global scope even after injection.");
      }
    });
  } catch (welcomeError) {
    console.warn(
      `[SiapDips] Welcome toast skipped for tab ${tabId}:`,
      welcomeError
    );
  }
}
