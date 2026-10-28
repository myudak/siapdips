import { createHelper, injectGlobalStyles } from "./helper";

export function createHelperDefault(
  message?: string,
  options?: { attach?: boolean }
) {
  if (message) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    Toastify({
      text: message,
      duration: 3000,
      close: true,
      position: "left",
    }).showToast();
  }
  // These styles exist to render the chat bubbles, and they use generic names
  // (@keyframes spin/pulse, .dragging) that could collide with the page's own
  // CSS. Skip them when the panel is built detached.
  if (options?.attach !== false) {
    injectGlobalStyles();
  }
  createHelper(options);
}
