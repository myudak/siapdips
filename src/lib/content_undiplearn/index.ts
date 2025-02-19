import { createHelper, injectGlobalStyles } from "./helper";

export function createHelperDefault(message?: string) {
  if (message) {
    // @ts-ignore
    Toastify({
      text: message,
      duration: 3000,
      close: true,
      position: "left",
    }).showToast();
  }
  injectGlobalStyles();
  createHelper();
}
