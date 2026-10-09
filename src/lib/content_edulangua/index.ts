import { createHelper, injectGlobalStyles } from "./helper";

export * from "./disclaimer";
export * from "./helper";
export * from "./config";
export * from "./draggable";

export function createHelperDefault(message?: string) {
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
  injectGlobalStyles();
  createHelper();
}

