/**
 * Food Truck auto-selection functionality
 */

/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-ts-comment */
import { execOnPage } from "../utils/execute-script";

declare const Toastify: any;

export function initFoodTruckAutoSelect(tabId: number): void {
  chrome.storage.local.get(["selectedLokasiFT"], function (result) {
    if (result.selectedLokasiFT) {
      execOnPage(tabId, (selectedLokasiFT: unknown) => {
        console.log(selectedLokasiFT);

        const selectElement = document.getElementById(
          "tanggal"
        ) as HTMLSelectElement | null;
        if (!selectElement) {
          console.warn("not found.");
          return;
        }

        const trimmedLokasi = (selectedLokasiFT as string).trim();

        for (const option of selectElement.options) {
          if (option.textContent?.trim().includes(trimmedLokasi)) {
            selectElement.value = option.value;
            // @ts-ignore
            Toastify({
              text: "Siap DIps ~~> FT Auto Select",
              duration: 3000,
              close: true,
              position: "left",
            }).showToast();
            if (option.disabled) {
              // @ts-ignore
              Toastify({
                text: "Siap DIps ~~> FT Option disabled",
                duration: 3000,
                close: true,
                position: "left",
              }).showToast();
            }

            selectElement.dispatchEvent(
              new Event("change", { bubbles: true, cancelable: true })
            );
            break;
          }
        }
      }, [result.selectedLokasiFT]);
    }
  });

  // Blur phone number
  execOnPage(tabId, () => {
    const nomorHp = document.querySelector("#mobile_phone") as HTMLElement;
    if (nomorHp) {
      nomorHp.style.filter = "blur(5px)";
    }
  });
}
