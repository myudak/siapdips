/**
 * SiapDips Content Bridge
 *
 * Content script that runs on undip pages. Receives execution requests
 * from the service worker or popup via chrome.runtime.onMessage and
 * executes JavaScript / injects CSS on the page.
 *
 * This bypasses the chrome.scripting.executeScript API which is blocked
 * on some pages by Chrome v130+ CSP enforcement.
 *
 * Protocol:
 *   { type: "bridge-exec", code?: string, css?: string }
 *   → response: { ok: true, result?: unknown } | { ok: false, error: string }
 */

interface BridgeResponse {
  ok: boolean;
  result?: unknown;
  error?: string;
}

console.log("[SiapDips] Content bridge aktif di:", location.hostname);

chrome.runtime.onMessage.addListener(
  (
    request: unknown,
    _sender: chrome.runtime.MessageSender,
    sendResponse: (response: BridgeResponse) => void
  ): boolean | undefined => {
    const msg = request as Record<string, unknown>;

    if (msg?.type !== "bridge-exec") {
      return undefined; // not for us
    }

    void handleBridgeMessage(msg, sendResponse);
    return true; // async response
  }
);

async function handleBridgeMessage(
  msg: Record<string, unknown>,
  sendResponse: (response: BridgeResponse) => void
): Promise<void> {
  try {
    // ---- CSS injection ----
    if (typeof msg.css === "string" && msg.css.length > 0) {
      let style = document.getElementById("siapdips-bridge-style");
      if (!style) {
        style = document.createElement("style");
        style.id = "siapdips-bridge-style";
        (document.head ?? document.documentElement).appendChild(style);
      }
      style.textContent += `\n/* siapdips-bridge */\n${msg.css}`;
      sendResponse({ ok: true });
      return;
    }

    // ---- Code execution (eval in ISOLATED world) ----
    if (typeof msg.code === "string" && msg.code.length > 0) {
      // Use await in an async IIFE to handle both sync and async (Promise) results
      // eslint-disable-next-line no-eval
      const result = await eval(
        `(async () => { return (${msg.code}); })()`
      );
      sendResponse({ ok: true, result });
      return;
    }

    sendResponse({
      ok: false,
      error: "bridge-exec: missing 'code' or 'css' field",
    });
  } catch (error) {
    sendResponse({
      ok: false,
      error: error instanceof Error ? error.message : String(error),
    });
  }
}
