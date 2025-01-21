console.log("myudak lagi cooking...");

const darkModeAllowedUrls: string[] = [
  "https://siap.undip.ac.id/",
  "https://sso.undip.ac.id/",
  "https://kulon2.undip.ac.id/",
];

// Listen to tab updates
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (tab.url === undefined) return;

  // DARK MODE
  if (
    changeInfo.status === "complete" &&
    tab.url &&
    darkModeAllowedUrls.some((url) => tab.url?.includes(url))
  ) {
    // CUSTOM THEME DARK MODE ETC
    chrome.storage.local.get("undipCustomTheme", (data) => {
      if (!data.undipCustomTheme || data.undipCustomTheme === "no") return;
      console.log(data);
      chrome.scripting
        .insertCSS({
          files: ["mode.min.css"],
          target: { tabId: tab.id! },
        })
        .catch((error: unknown) => {
          console.error("Failed to inject CSS:", error);
        });

      chrome.storage.local.get("undipCustomThemeValue", (value) => {
        console.log("value", value);
        if (!value.undipCustomThemeValue) return;
        chrome.scripting.executeScript({
          target: { tabId: tab.id! },
          args: [value.undipCustomThemeValue],
          func: (value) => {
            document.documentElement.classList.add(`${value}-theme`);
          },
        });
      });
    });

    // ENABLE CTRL C
    chrome.storage.local.get(
      "disableCtrlC",
      (data: { disableCtrlC?: boolean }) => {
        if (data.disableCtrlC === true) {
          chrome.scripting.executeScript({
            target: { tabId: tab.id! },
            func: disableCtrlC,
          });
        }
        if (data.disableCtrlC === undefined) {
          chrome.storage.local.set({ disableCtrlC: true });
          chrome.scripting.executeScript({
            target: { tabId: tab.id! },
            func: disableCtrlC,
          });
        }
      }
    );
  }

  // HIDE POP UP
  if (tab.url?.includes("https://sso.undip.ac.id/pages/dashboard")) {
    chrome.storage.local.get("hidePopup", (data: { hidePopup?: boolean }) => {
      if (data.hidePopup) {
        chrome.scripting.executeScript({
          target: { tabId: tab.id! },
          func: hidePopup,
        });
      }
    });
  }

  if (
    changeInfo.status === "loading" &&
    tab.url.includes(
      "https://siap.undip.ac.id/evaluasi_perkuliahan/mhs/evaluasi"
    )
  ) {
    chrome.scripting.executeScript({
      target: { tabId },
      func: PBM,
    });
  }
});

// Hide popup function
function hidePopup(): void {
  console.log("HIDE POPP UP");
  const popupElement =
    document.querySelector<HTMLDivElement>(".swal2-container");
  if (popupElement) {
    popupElement.style.display = "none";
    document.body.style.overflow = "auto"; // Fix scrolling issue
  }
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
      // Skip header rows (they have a 'text-bold-700' class)
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

        // KONEKSI INTERNET
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

        // PERANGKAT
        const HPRadio = radioDiv.querySelector(
          `input[value="HP"]`
        ) as HTMLElement;
        const LaptopRadio = radioDiv.querySelector(
          `input[value="Laptop"]`
        ) as HTMLElement;
        const DesktopRadio = radioDiv.querySelector(
          `input[value="Desktop"]`
        ) as HTMLElement;

        // METODE
        const KuliahOnlineRadio = radioDiv.querySelector(
          `input[value="Kuliah Online"]`
        ) as HTMLElement;
        const TatapMukaRadio = radioDiv.querySelector(
          `input[value="Tatap Muka"]`
        ) as HTMLElement;

        // Media
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
          }

          // KONEKSI INTERNET
          else if (setting === "Wifi Rumah/Kos" && WifiRumahKosRadio) {
            WifiRumahKosRadio.click();
          } else if (setting === "Internet HP" && InternetHPRadio) {
            InternetHPRadio.click();
          } else if (setting === "Wifi Kampus" && WifiKampusRadio) {
            WifiKampusRadio.click();
          } else if (setting === "Tethering Teman" && TetheringTemanRadio) {
            TetheringTemanRadio.click();
          }

          // PERANGKAT
          else if (setting === "HP" && HPRadio) {
            HPRadio.click();
          } else if (setting === "Laptop" && LaptopRadio) {
            LaptopRadio.click();
          } else if (setting === "Desktop" && DesktopRadio) {
            DesktopRadio.click();
          }

          // METODE
          else if (setting === "Kuliah Online" && KuliahOnlineRadio) {
            KuliahOnlineRadio.click();
          } else if (setting === "Tatap Muka" && TatapMukaRadio) {
            TatapMukaRadio.click();
          }

          // Media
          else if (setting === "Ms Teams" && MsTeamsRadio) {
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
          for (let mutation of mutationsList) {
            if (mutation.type === "childList") {
              automateTableResponses(settings, autoSubmit);
              observer.disconnect();
              break;
            }
          }
        });

        observer.observe(document.body, { childList: true, subtree: true });

        i++;
        setTimeout(changeValue, 1000); // Delay of 1 second
      }
    };

    changeValue();
  }

  const defaultSettingsPBM = {
    1: "Ada",
    2: "Ada",
    3: "Ada",
    4: "Ada",
    5: "Ada",
    6: "Ada",
    7: "Ada",
    8: "Ada",
    9: "Ada",
    10: "Ada",
    11: "Ada",
    12: "Ya",
    13: "Wifi Rumah/Kos",
    14: "Laptop",
    15: "Kuliah Online",
    16: "Lainnya",
    17: "Ada",
    18: "Ada",
    19: "Ada",
    20: "Ada",
    21: "Ada",
    22: "Ada",
    23: "Ada",
    24: "Ada",
    25: "Ya",
    26: "Ya",
    27: "Ya",
    28: "Ya",
    29: "Ya",
    30: "Ya",
    31: "Ya",
    32: "Ya",
    33: "Ya",
    34: "Ya",
  };

  const headerElement = document.querySelector("div.card-header");
  if (headerElement) {
    const container = document.createElement("div");
    container.className = "form-check form-check-inline mt-3";

    // Add checkbox for auto submit
    const autoSubmitCheckbox = document.createElement("input");
    autoSubmitCheckbox.type = "checkbox";
    autoSubmitCheckbox.className = "form-check-input";
    // autoSubmitCheckbox.id = "autoSubmitCheckbox";
    // autoSubmitCheckbox.onclick = () => {
    //   autoSubmitCheckbox.checked = !autoSubmitCheckbox.checked;
    // };
    autoSubmitCheckbox.id = "autoSubmitMyudak";

    const autoSubmitLabel = document.createElement("label");
    autoSubmitLabel.className = "form-check-label";
    autoSubmitLabel.textContent = "Auto Submit";
    autoSubmitLabel.setAttribute("for", "autoSubmitMyudak");

    // Add checkbox for select all dosen
    const selectAllDosenCheckbox = document.createElement("input");
    selectAllDosenCheckbox.type = "checkbox";
    selectAllDosenCheckbox.className = "form-check-input ml-2";
    selectAllDosenCheckbox.id = "selectAllDosenCheckbox";
    selectAllDosenCheckbox.checked = false;

    const selectAllDosenLabel = document.createElement("label");
    selectAllDosenLabel.className = "form-check-label";
    selectAllDosenLabel.textContent = "Select All Dosen";
    selectAllDosenLabel.setAttribute("for", "selectAllDosenCheckbox");

    // Event listener for the button
    const button = document.createElement("button");
    button.className = "btn btn-primary ml-2";
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
      // automateTableResponses(defaultSettingsPBM);
    });

    const txt = document.createElement("p");
    txt.className = "bg-info text-white mr-2";
    txt.textContent = "myudakk ~> automate eval PBM 〜(￣▽￣〜)";

    // selectAllDosenCheckbox.addEventListener("change", function () {
    //   autoSubmitCheckbox.checked = this.checked;
    // });

    // Append elements to the container
    container.appendChild(txt); // TEXT KIRI

    container.appendChild(autoSubmitCheckbox);
    container.appendChild(autoSubmitLabel);

    container.appendChild(button);

    container.appendChild(buttonAll);

    // Append the container to the header
    headerElement.appendChild(container);

    // BYPASS
  }
}

function disableCtrlC() {
  (function () {
    const unblockActions = () => {
      // Stop custom handlers for Ctrl+C
      document.addEventListener(
        "keydown",
        (event) => {
          if ((event.ctrlKey || event.metaKey) && event.key === "c") {
            event.stopPropagation(); // Stop any custom behavior
            console.log("Ctrl+C is unblocked.");
          }
        },
        true
      );

      document.addEventListener(
        "keyup",
        (event) => {
          if ((event.ctrlKey || event.metaKey) && event.key === "c") {
            event.stopPropagation(); // Stop any custom behavior
            console.log("Ctrl+C is unblocked.");
          }
        },
        true
      );

      // Remove all custom event listeners for key events
      const originalAddEventListener = Element.prototype.addEventListener;
      Element.prototype.addEventListener = function (
        type: string,
        listener: any,
        options: any
      ) {
        if (type === "keydown" || type === "keyup") {
          console.warn(`Blocked ${type} listener for Ctrl+C.`);
          return;
        }
        originalAddEventListener.call(this, type, listener, options);
      };

      // Clear any inline `onkeydown` or `onkeyup` handlers
      const elements = document.querySelectorAll("*");
      elements.forEach((el) => {
        // @ts-ignore
        el.onkeydown = null;
        // @ts-ignore
        el.onkeyup = null;
      });

      document.oncontextmenu = null;

      document.addEventListener(
        "contextmenu",
        function (e) {
          e.stopPropagation(); // Stop other listeners from running
        },
        true // Use the capture phase
      );

      console.log("All custom Ctrl+C behaviors are disabled.");
    };

    // Run unblock function
    unblockActions();

    // Observe DOM changes and re-apply if necessary
    const observer = new MutationObserver(unblockActions);
    observer.observe(document, { childList: true, subtree: true });
  })();
}
