/**
 * Bridge-aware executeScript fallback utility
 *
 * Tries chrome.scripting.executeScript/insertCSS first.
 * If the call fails with "Blocked" (Chrome v130+ CSP enforcement),
 * falls back to the content bridge via chrome.tabs.sendMessage.
 *
 * Usage:
 *   import { execOnPage, execFileOnPage, execCSSOnPage } from "../utils/execute-script";
 *
 *   // Execute a function
 *   await execOnPage(tabId, () => { ... });
 *
 *   // Execute with arguments
 *   await execOnPage(tabId, (x, y) => x + y, [1, 2]);
 *
 *   // Inject a file (like libs/toastify.js)
 *   await execFileOnPage(tabId, "libs/toastify.js");
 *
 *   // Inject a CSS file
 *   await execCSSOnPage(tabId, "libs/toastify.css");
 */

interface BridgeRequest {
  type: "bridge-exec";
  code?: string;
  css?: string;
}

interface BridgeResponse {
  ok: boolean;
  result?: unknown;
  error?: string;
}

type InjectionResult<T = unknown> = { result?: T };

/**
 * Tracks whether a tab has been confirmed as "blocked" (needs bridge).
 * Avoids the overhead of trying executeScript first on every call.
 */
const blockedTabs = new Set<number>();

/**
 * Reset blocked-tab cache. Call if a tab navigates or permissions change.
 */
export function resetBlockedCache(tabId?: number): void {
  if (tabId !== undefined) {
    blockedTabs.delete(tabId);
  } else {
    blockedTabs.clear();
  }
}

// ---- helpers ---------------------------------------------------

function isBlockedError(error: unknown): boolean {
  if (!(error instanceof Error)) return false;
  const msg = error.message.toLowerCase();
  return (
    msg.includes("blocked") ||
    msg.includes("cannot access") ||
    msg.includes("content security policy") ||
    msg.includes("csp") ||
    msg.includes("cannot execute script")
  );
}

function funcToCode(fn: (...args: unknown[]) => unknown, args?: unknown[]): string {
  const serializedArgs = args
    ? args.map((a) => JSON.stringify(a)).join(",")
    : "";
  return `(${fn.toString()})(${serializedArgs})`;
}

async function sendToBridge<T>(
  tabId: number,
  request: BridgeRequest,
  retries = 2
): Promise<T> {
  let lastError: unknown;
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const response: BridgeResponse = await chrome.tabs.sendMessage(tabId, request);
      if (!response?.ok) {
        throw new Error(response?.error ?? "Bridge returned error");
      }
      // Mark tab as bridge-enabled so executeScript is skipped next time
      blockedTabs.add(tabId);
      return response.result as T;
    } catch (error) {
      lastError = error;
      if (attempt < retries) {
        const delay = 300 * Math.pow(2, attempt);
        await new Promise((r) => setTimeout(r, delay));
      }
    }
  }
  throw lastError;
}

// ---- Public API -------------------------------------------------

/**
 * Execute a function on a page. Tries executeScript first,
 * falls back to content bridge on "Blocked".
 * Supports both sync and async (Promise-returning) functions.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function execOnPage<T>(
  tabId: number,
  fn: (...args: any[]) => T | Promise<T>,
  args?: unknown[]
): Promise<T> {
  // Skip executeScript attempt if tab is known to be blocked
  if (!blockedTabs.has(tabId)) {
    try {
      const results = await chrome.scripting.executeScript({
        target: { tabId },
        func: fn,
        args: args ?? [],
      });
      return (results[0] as InjectionResult<T> | undefined)?.result as T;
    } catch (error) {
      if (!isBlockedError(error)) throw error;
      // Fall through to bridge
    }
  }

  const code = funcToCode(fn, args);
  return sendToBridge<T>(tabId, { type: "bridge-exec", code });
}

/**
 * Inject a JS file on a page. Tries executeScript first,
 * falls back to content bridge.
 */
export async function execFileOnPage<T>(
  tabId: number,
  filePath: string
): Promise<T> {
  if (!blockedTabs.has(tabId)) {
    try {
      const results = await chrome.scripting.executeScript({
        target: { tabId },
        files: [filePath],
      });
      return (results[0] as InjectionResult<T> | undefined)?.result as T;
    } catch (error) {
      if (!isBlockedError(error)) throw error;
    }
  }

  // Fallback: fetch file content and send to bridge
  const url = chrome.runtime.getURL(filePath);
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch ${filePath}: HTTP ${response.status}`);
  }
  const code = await response.text();
  return sendToBridge<T>(tabId, { type: "bridge-exec", code });
}

/**
 * Inject a CSS file on a page. Tries insertCSS first,
 * falls back to content bridge.
 */
export async function execCSSOnPage(
  tabId: number,
  cssFilePath: string
): Promise<void> {
  if (!blockedTabs.has(tabId)) {
    try {
      await chrome.scripting.insertCSS({
        target: { tabId },
        files: [cssFilePath],
      });
      return;
    } catch (error) {
      if (!isBlockedError(error)) throw error;
    }
  }

  // Fallback: fetch CSS content and send to bridge
  const url = chrome.runtime.getURL(cssFilePath);
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch CSS ${cssFilePath}: HTTP ${response.status}`);
  }
  const css = await response.text();
  await sendToBridge(tabId, { type: "bridge-exec", css });
}
