/**
 * PBM (Penilaian Beban Mengajar) automation functionality
 */

/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-ts-comment */
declare const Toastify: any;

import { DEFAULT_SETTINGS_PBM } from "../config/constants";

export function initPBMAutomation(tabId: number): void {
  chrome.scripting.executeScript({
    target: { tabId },
    func: PBM,
  });
}

function PBM() {
  console.log("PBM");

  function automateTableResponses(
    settings: { [key: number]: string },
    autoSubmit: boolean
  ) {
    const tbody = document.querySelector("tbody");
    if (!tbody) {
      console.error("Could not find the <tbody> element.");
      return;
    }

    const rows = tbody.querySelectorAll("tr");

    let questionNumber = 0;

    rows.forEach((row) => {
      if (row.classList.contains("text-bold-700")) {
        return;
      }

      const radioDiv = row.querySelector("td:last-child .row");

      if (radioDiv) {
        questionNumber++;
        const adaRadio = radioDiv.querySelector(
          `input[value="Ada"]`
        ) as HTMLElement;
        const tidakRadio = radioDiv.querySelector(
          `input[value="Tidak"]`
        ) as HTMLElement;

        const YaRadio = radioDiv.querySelector(
          `input[value="Ya"]`
        ) as HTMLElement;

        const WifiRumahKosRadio = radioDiv.querySelector(
          `input[value="Wifi Rumah/Kos"]`
        ) as HTMLElement;
        const InternetHPRadio = radioDiv.querySelector(
          `input[value="Internet HP"]`
        ) as HTMLElement;
        const WifiKampusRadio = radioDiv.querySelector(
          `input[value="Wifi Kampus"]`
        ) as HTMLElement;
        const TetheringTemanRadio = radioDiv.querySelector(
          `input[value="Tethering Teman"]`
        ) as HTMLElement;

        const HPRadio = radioDiv.querySelector(
          `input[value="HP"]`
        ) as HTMLElement;
        const LaptopRadio = radioDiv.querySelector(
          `input[value="Laptop"]`
        ) as HTMLElement;
        const DesktopRadio = radioDiv.querySelector(
          `input[value="Desktop"]`
        ) as HTMLElement;

        const KuliahOnlineRadio = radioDiv.querySelector(
          `input[value="Kuliah Online"]`
        ) as HTMLElement;
        const TatapMukaRadio = radioDiv.querySelector(
          `input[value="Tatap Muka"]`
        ) as HTMLElement;

        const WebexRadio = radioDiv.querySelector(
          `input[value="Webex"]`
        ) as HTMLElement;
        const MsTeamsRadio = radioDiv.querySelector(
          `input[value="Ms Teams"]`
        ) as HTMLElement;
        const LainnyaRadio = radioDiv.querySelector(
          `input[value="Lainnya"]`
        ) as HTMLElement;

        if (
          adaRadio ||
          tidakRadio ||
          YaRadio ||
          WifiRumahKosRadio ||
          HPRadio ||
          KuliahOnlineRadio ||
          WebexRadio
        ) {
          const setting = settings[questionNumber];

          if (setting === "Ada" && adaRadio) {
            adaRadio.click();
          } else if (setting === "Tidak" && tidakRadio) {
            tidakRadio.click();
          } else if (setting === "Ya" && YaRadio) {
            YaRadio.click();
          } else if (setting === "Wifi Rumah/Kos" && WifiRumahKosRadio) {
            WifiRumahKosRadio.click();
          } else if (setting === "Internet HP" && InternetHPRadio) {
            InternetHPRadio.click();
          } else if (setting === "Wifi Kampus" && WifiKampusRadio) {
            WifiKampusRadio.click();
          } else if (setting === "Tethering Teman" && TetheringTemanRadio) {
            TetheringTemanRadio.click();
          } else if (setting === "HP" && HPRadio) {
            HPRadio.click();
          } else if (setting === "Laptop" && LaptopRadio) {
            LaptopRadio.click();
          } else if (setting === "Desktop" && DesktopRadio) {
            DesktopRadio.click();
          } else if (setting === "Kuliah Online" && KuliahOnlineRadio) {
            KuliahOnlineRadio.click();
          } else if (setting === "Tatap Muka" && TatapMukaRadio) {
            TatapMukaRadio.click();
          } else if (setting === "Ms Teams" && MsTeamsRadio) {
            MsTeamsRadio.click();
          } else if (setting === "Lainnya" && LainnyaRadio) {
            LainnyaRadio.click();
          } else if (setting === "Webex" && WebexRadio) {
            WebexRadio.click();
          }
        } else {
          console.warn(
            `Could not find radio buttons for question number ${questionNumber}`
          );
        }
      }
    });

    if (autoSubmit) {
      const tombolSUbmit = document.querySelector<HTMLButtonElement>(
        "span.btn.btn-success.btn-sm.mb-1.simpan-kuisioner"
      );
      if (tombolSUbmit) tombolSUbmit.click();
    }
  }

  function automateAllPBM(
    settings: { [key: number]: string },
    autoSubmit: boolean
  ) {
    // @ts-ignore
    const options = document
      .getElementById("dosen_pengampu")
      .querySelectorAll("option");
    const dosen = Array.from(options)
      .map((option) => option.value)
      .filter((value) => value !== "");

    let i = 0;
    const changeValue = () => {
      if (i < dosen.length) {
        const selectElement = document.getElementById("dosen_pengampu");
        // @ts-ignore
        selectElement.value = dosen[i];

        const event = new Event("change");
        selectElement?.dispatchEvent(event);

        const observer = new MutationObserver((mutationsList, observer) => {
          for (const mutation of mutationsList) {
            if (mutation.type === "childList") {
              automateTableResponses(settings, autoSubmit);
              observer.disconnect();
              break;
            }
          }
        });

        observer.observe(document.body, { childList: true, subtree: true });

        i++;
        setTimeout(changeValue, 1000);
      }
    };

    changeValue();
  }

  const defaultSettingsPBM = DEFAULT_SETTINGS_PBM;

  const headerElement = document.querySelector("div.card-header");
  if (headerElement) {
    const container = document.createElement("div");
    container.className = "form-check form-check-inline mt-3";

    const autoSubmitCheckbox = document.createElement("input");
    autoSubmitCheckbox.type = "checkbox";
    autoSubmitCheckbox.className = "form-check-input";
    autoSubmitCheckbox.id = "autoSubmitMyudak";

    const autoSubmitLabel = document.createElement("label");
    autoSubmitLabel.className = "form-check-label";
    autoSubmitLabel.textContent = "Auto Submit";
    autoSubmitLabel.setAttribute("for", "autoSubmitMyudak");

    const selectAllDosenCheckbox = document.createElement("input");
    selectAllDosenCheckbox.type = "checkbox";
    selectAllDosenCheckbox.className = "form-check-input ml-2";
    selectAllDosenCheckbox.id = "selectAllDosenCheckbox";
    selectAllDosenCheckbox.checked = false;

    const selectAllDosenLabel = document.createElement("label");
    selectAllDosenLabel.className = "form-check-label";
    selectAllDosenLabel.textContent = "Select All Dosen";
    selectAllDosenLabel.setAttribute("for", "selectAllDosenCheckbox");

    const button = document.createElement("button");
    button.className = "btn btn-secondary ml-2";
    button.textContent = "~Auto This~";
    button.addEventListener("click", () => {
      const autoSubmit = autoSubmitCheckbox.checked;

      const getSettingsPBM = async () => {
        const settingsPBM = await chrome.storage.local.get(["settingsPBM"]);
        if (settingsPBM.settingsPBM) {
          automateTableResponses(settingsPBM.settingsPBM, autoSubmit);
        } else {
          await chrome.storage.local.set({ settingsPBM: defaultSettingsPBM });
          automateTableResponses(defaultSettingsPBM, autoSubmit);
        }
      };
      getSettingsPBM();
      console.log("CLICKED");
      //@ts-ignore
      Toastify({
        text: "Done ~> Auto This PBM",
        duration: 1000,
        close: true,
        gravity: "top",
        position: "left",
      }).showToast();
    });

    const buttonAll = document.createElement("button");
    buttonAll.className = "btn btn-primary ml-2";
    buttonAll.textContent = "~Auto All~";
    buttonAll.addEventListener("click", () => {
      if (
        !window.confirm(
          "myudakk ~> You really want to Auto Submit PBM {current setting} alll dosen?"
        )
      )
        return;

      const autoSubmit = autoSubmitCheckbox.checked;

      const getSettingsPBM = async () => {
        const settingsPBM = await chrome.storage.local.get(["settingsPBM"]);
        if (settingsPBM.settingsPBM) {
          automateAllPBM(settingsPBM.settingsPBM, autoSubmit);
        } else {
          await chrome.storage.local.set({ settingsPBM: defaultSettingsPBM });
          automateAllPBM(defaultSettingsPBM, autoSubmit);
        }
      };
      getSettingsPBM();
      console.log("CLICKED");
      //@ts-ignore
      Toastify({
        text: "Done ~> Auto All PBM",
        duration: 1000,
        close: true,
        gravity: "top",
        position: "left",
      }).showToast();
    });

    const buttonEmpty = document.createElement("button");
    buttonEmpty.className = "btn btn-danger ml-2";
    buttonEmpty.textContent = "Clear";
    buttonEmpty.addEventListener("click", () => {
      const radioInputs: NodeListOf<HTMLInputElement> =
        document.querySelectorAll('.table input[type="radio"]');

      radioInputs.forEach((input: HTMLInputElement) => {
        input.checked = false;
      });

      //@ts-ignore
      Toastify({
        text: "Cleared",
        duration: 1000,
        close: true,
        gravity: "top",
        position: "left",
      }).showToast();
    });

    const txt = document.createElement("p");
    txt.className = "bg-info text-white mr-2";
    txt.textContent = "SiAp DiPS ~> automate eval PBM 〜(￣▽￣〜)";

    container.appendChild(txt);

    container.appendChild(autoSubmitCheckbox);
    container.appendChild(autoSubmitLabel);

    container.appendChild(button);

    container.appendChild(buttonAll);

    container.appendChild(buttonEmpty);

    headerElement.appendChild(container);
  }
}
