/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-ts-comment */
console.log("myudak lagi cooking...");

const DARK_MODE_ALLOWED_URLS: string[] = [
  "https://siap.undip.ac.id/",
  "https://sso.undip.ac.id/",
  "https://kulon2.undip.ac.id/",
  "https://undip.learnsocial.online",
  "https://form.undip.ac.id/",
];

const CHECK_INTERVAL_MINUTES = 1;

// INIT SiapDips Suspender
setupAlarmsFromStorage();

// React to setting changes
chrome.storage.onChanged.addListener((changes, area) => {
  if (area === "local") {
    if (
      changes.timerSuspend ||
      changes.timerAutoCloseSuspend ||
      changes.timerAutoCloseTabs
    ) {
      setupAlarmsFromStorage();
    }
  }
});

// SETUP ALARAM
function setupAlarmsFromStorage() {
  chrome.alarms.clearAll();

  chrome.storage.local.get(
    ["timerSuspend", "timerAutoCloseSuspend", "timerAutoCloseTabs"],
    (result) => {
      if (result.timerSuspend && result.timerSuspend !== "never") {
        chrome.alarms.create("checkTabs", {
          periodInMinutes: CHECK_INTERVAL_MINUTES,
        });
      }

      if (
        result.timerAutoCloseSuspend &&
        result.timerAutoCloseSuspend !== "never"
      ) {
        const autoCloseMinutes = suspendTimeToMinutes(
          result.timerAutoCloseSuspend
        );
        if (autoCloseMinutes) {
          chrome.alarms.create("closeSuspendedTabs", {
            periodInMinutes: autoCloseMinutes,
          });
        }
      }

      if (result.timerAutoCloseTabs && result.timerAutoCloseTabs !== "never") {
        chrome.alarms.create("autoCloseTabs", {
          periodInMinutes: CHECK_INTERVAL_MINUTES,
        });
      }
    }
  );
}

/* 
CHROME FIRST INSTALL LISTENER
  runtime.onInstalled
*/
chrome.runtime.onInstalled.addListener((details) => {
  // INIT SiapDips Suspender
  setupAlarmsFromStorage();
  // Context Menus
  chrome.contextMenus.create({
    id: "suspend-tab",
    title: "💤 Suspend this tab",
    contexts: ["page"],
  });
  chrome.contextMenus.create({
    id: "close-all-suspend-tab",
    title: "😶‍🌫️ Close all suspended tabs",
    contexts: ["page"],
  });
  // on boarding
  if (details.reason === "install") {
    chrome.runtime.openOptionsPage();
  }
});

// Run on browser start
chrome.runtime.onStartup.addListener(() => {
  setupAlarmsFromStorage();
});

/* 
CHROME TAB UPDATE LISTENER PER TAB BASIS
  tabs.onUpdated
*/
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (tab.url === undefined) return;

  // LEARN SOCIAL
  if (
    changeInfo.status === "complete" &&
    tab.url.includes("https://undip.learnsocial.online/")
  ) {
    // TOASTIFY
    chrome.scripting.executeScript({
      target: { tabId },
      files: ["libs/toastify.js"],
    });
    chrome.scripting.insertCSS({
      target: { tabId },
      files: ["libs/toastify.css"],
    });
    // TOASTIFY
  }

  // JADWAL
  if (
    changeInfo.status === "complete" &&
    tab.url.includes("https://siap.undip.ac.id/jadwal_mahasiswa/mhs/jadwal/")
  ) {
    chrome.scripting.executeScript({
      target: { tabId },
      func: parseTableToJsonAndSave,
    });
  }

  // DARK MODE
  if (
    changeInfo.status === "complete" &&
    tab.url &&
    DARK_MODE_ALLOWED_URLS.some((url) => tab.url?.includes(url))
  ) {
    console.log("BACKGROUND SCRIPT~ for:", tab.url);
    // TOASTIFY
    if (
      !tab.url.includes("https://undip.learnsocial.online/") &&
      !tab.url.includes("https://form.undip.ac.id/")
    ) {
      Promise.all([
        chrome.scripting.executeScript({
          target: { tabId },
          files: ["libs/toastify.js"],
        }),
        chrome.scripting.insertCSS({
          target: { tabId },
          files: ["libs/toastify.css"],
        }),
      ])
        .then(() => {
          chrome.scripting.executeScript({
            target: { tabId },
            func: () => {
              // @ts-ignore
              if (typeof Toastify !== "undefined") {
                // @ts-ignore
                Toastify({
                  text: "SiAp DiPS ~> Welcome ヽ（≧□≦）ノ",
                  duration: 3000,
                  close: true,
                  position: "right",
                  // ... other Toastify options ...
                }).showToast();
              } else {
                console.error("❌ Toastify is not loaded!");
              }
            },
          });
        })
        .catch((error) => {
          console.error("❌ Failed to load Toastify:", error);
        });
    }
    // TOASTIFY

    // PROGRESS BAR
    chrome.scripting.executeScript({
      target: { tabId: tab.id! },
      func: () => {
        const progressBar = document.querySelectorAll(
          ".progress-bar"
        ) as NodeListOf<HTMLElement>;
        if (progressBar.length > 0) {
          progressBar.forEach((e) => {
            e.style.width = "100%";
          });
        }
      },
    });

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
    if (
      !tab.url?.includes("https://form.undip.ac.id/makanansehat") &&
      !tab.url?.includes("https://undip.learnsocial.online")
    ) {
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

    // BLUR USERNAME PROFILE NIM PRODI
    if (!tab.url?.includes("https://sso.undip.ac.id/auth/user/login")) {
      chrome.storage.local.get(
        [
          "isBlurredUsername",
          "isBlurredNim",
          "isBlurredProdi",
          "isBlurredAvatar",
          "isBlurredDosenWali",
          "isBlurred",
        ],
        (data) => {
          if (data.isBlurredUsername) {
            chrome.scripting.executeScript({
              target: { tabId: tab.id! },
              func: () => {
                const blurElements = [
                  "#user-profile > div > div.card.profile-with-cover > div.media.profil-cover-details.w-100 > div.media-body.pt-3.px-2 > div > div:nth-child(1) > h3",
                  "#navbar-mobile > ul.nav.navbar-nav.float-right > li.dropdown.dropdown-user.nav-item > a > span.user-name",
                  "#irs_left_sidebar > div > div > div.bg-grey.bg-lighten-3.p-1.border-grey.mt-1 > table:nth-child(1) > tbody > tr:nth-child(1) > th",
                  "#irs_left_sidebar > div > div > div.bg-grey.bg-lighten-3.p-1.border-grey.mt-1 > table:nth-child(1) > tbody > tr:nth-child(2) > th",
                  "body > div.rootPanelStyle > div.screenTableStyle > div.menuTdScreenStyle > div > div > div.navbarMenuOuter > div:nth-child(4) > div > div.userStatusText",
                  "#nama",
                ];

                blurElements.forEach((selector) => {
                  const element = document.querySelector(selector);
                  if (element) {
                    (element as HTMLElement).style.filter = "blur(5px)";
                  }
                });
              },
            });
          }
          if (data.isBlurredNim) {
            chrome.scripting.executeScript({
              target: { tabId: tab.id! },
              func: () => {
                const blurNim = [
                  "#user-profile > div > div.card.profile-with-cover > div:nth-child(3) > span",
                  "#identity",
                ];

                blurNim.forEach((selector) => {
                  const element = document.querySelector(selector);
                  if (element) {
                    (element as HTMLElement).style.filter = "blur(5px)";
                  }
                });
              },
            });
          }
          if (data.isBlurredAvatar) {
            chrome.scripting.executeScript({
              target: { tabId: tab.id! },
              func: () => {
                const blurSelectors = [
                  ".profile-image", // Parent element that contains the avatar
                  "#navbar-mobile > ul.nav.navbar-nav.float-right > li.dropdown.dropdown-user.nav-item > a > span.avatar._avatar-online > div",
                ];

                blurSelectors.forEach((selector) => {
                  const element = document.querySelector<HTMLElement>(selector);

                  if (element) {
                    if (
                      selector === ".profile-image" &&
                      element.childNodes.length > 1
                    ) {
                      const avatarChild = element.childNodes[1] as HTMLElement;
                      avatarChild.style.filter = "blur(5px)";
                    } else {
                      element.style.filter = "blur(5px)";
                    }
                  }
                });
              },
            });
          }
          if (data.isBlurredDosenWali) {
            chrome.scripting.executeScript({
              target: { tabId: tab.id! },
              func: () => {
                const blurElements = [
                  "#tabmhs_dashboard > div.row > div.col-md-8 > div > div.card-body.pt-0 > div.mb-2 > div",
                ];

                blurElements.forEach((selector) => {
                  const element = document.querySelector(selector);
                  if (element) {
                    (element as HTMLElement).style.filter = "blur(5px)";
                  }
                });
              },
            });
          }
          // IPK BLUR
          if (data.isBlurred) {
            chrome.scripting.executeScript({
              target: { tabId: tab.id! },
              func: () => {
                const blurElements = [
                  "#irs_left_sidebar > div > div > div.bg-grey.bg-lighten-3.p-1.border-grey.mt-1 > table:nth-child(3) > tbody > tr:nth-child(4) > td:nth-child(3)",
                  "#irs_left_sidebar > div > div > div.bg-grey.bg-lighten-3.p-1.border-grey.mt-1 > table:nth-child(3) > tbody > tr:nth-child(5) > td:nth-child(3)",
                ];

                blurElements.forEach((selector) => {
                  const element = document.querySelector(selector);
                  if (element) {
                    (element as HTMLElement).style.filter = "blur(5px)";
                  }
                });
              },
            });
          }
        }
      );
    }

    // CHANGE PROFILE
    chrome.storage.local.get("profileImageLocal", (data) => {
      if (data.profileImageLocal) {
        chrome.scripting.executeScript({
          target: { tabId: tab.id! },
          args: [data],
          func: (data) => {
            const profileImages = [
              document.querySelector(
                "#user-profile > div > div.card.profile-with-cover > div.media.profil-cover-details.w-100 > div.media-left.pl-2.pt-2 > a > div"
              ) as HTMLElement,
              document.querySelector(
                "#navbar-mobile > ul.nav.navbar-nav.float-right > li.dropdown.dropdown-user.nav-item > a > span.avatar._avatar-online > div"
              ) as HTMLElement,
            ];

            profileImages.forEach((image) => {
              if (image) {
                image.style.backgroundImage = `url(${data.profileImageLocal})`;
              }
            });

            // FORM UNDIP FOOD TRUK
            const profileImage = document.querySelector(
              "#navbar-mobile > ul.nav.navbar-nav.float-right > li > a > span.avatar.avatar-online > img"
            ) as HTMLImageElement;
            if (profileImage) {
              profileImage.src = data.profileImageLocal;
            }
          },
        });
      }
    });
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

  // FOOD TRUK
  if (
    changeInfo.status === "complete" &&
    tab.url.includes("https://form.undip.ac.id/makanansehat/pendaftaran")
  ) {
    chrome.storage.local.get(["selectedLokasiFT"], function (result) {
      if (result.selectedLokasiFT) {
        chrome.scripting.executeScript({
          target: { tabId },
          args: [result.selectedLokasiFT],
          func: (selectedLokasiFT: string) => {
            console.log(selectedLokasiFT);

            const selectElement = document.getElementById(
              "tanggal"
            ) as HTMLSelectElement | null;
            if (!selectElement) {
              console.warn("not found.");
              return;
            }

            const trimmedLokasi = selectedLokasiFT.trim();

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
          },
        });
      }
    });
    chrome.scripting.executeScript({
      target: { tabId: tabId },
      func: () => {
        const nomorHp = document.querySelector("#mobile_phone") as HTMLElement;
        if (nomorHp) {
          nomorHp.style.filter = "blur(5px)";
        }
      },
    });
  }
});

/* 
CHROME ALARAM LISTENER
  onAlarm
*/
chrome.alarms.onAlarm.addListener(async (alarm) => {
  switch (alarm.name) {
    case "checkTabs":
      await TabSuspenderAlarm();
      break;
    case "closeSuspendedTabs":
      await closeSuspendedTabsAlarm();
      break;
    case "autoCloseTabs":
      await AutoCloseTabsAlarm();
      break;
  }
});

/* 
CHROME CONTEXT MENU LISTENER
  contextMenus.onClicked
*/
chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (
    info.menuItemId === "suspend-tab" &&
    tab?.id &&
    tab.url?.startsWith("http")
  ) {
    const encodedUrl = encodeURIComponent(tab.url);
    const encodedTitle = encodeURIComponent(tab.title ?? "Sleeping Tab");
    const encodedFavicon = encodeURIComponent(tab.favIconUrl ?? "");

    const suspendUrl =
      chrome.runtime.getURL("suspended.html") +
      `#url=${encodedUrl}&title=${encodedTitle}&favicon=${encodedFavicon}`;

    chrome.tabs.update(tab.id, { url: suspendUrl });
  }
  if (info.menuItemId === "close-all-suspend-tab") {
    closeAllSuspendedTabs();
  }
});

/* 
CHROME MESSAGE LISTENER
  runtime.onMessage
*/
chrome.runtime.onMessage.addListener((message) => {
  if (message.type === "closeAllSuspendedTabsNow") {
    closeAllSuspendedTabs();
  }
  if (message.type === "suspendAllTabsNow") {
    SuspendAllThoseTabsNow();
  }
  if (message.type === "closeAllTabsNow") {
    CloseThoseTabsNow();
  }
});

// SiapDips Suspender //>>
// SiapDips Suspender //
// SiapDips Suspender //
// SiapDips Suspender //
// SiapDips Suspender //
async function TabSuspenderAlarm() {
  console.log("🔔 Checking tabs for suspension...");

  const result = await new Promise<any>((resolve) =>
    chrome.storage.local.get(
      [
        "timerSuspend",
        "suspendPinnedTabs",
        "suspendUnsavedInputs",
        "suspendActiveTab",
        "suspendAudioTabs",
      ],
      resolve
    )
  );

  if (!result.timerSuspend || result.timerSuspend === "never") {
    console.log("🔔 No suspension timer set. Skipping...");
    return;
  }

  const SUSPEND_AFTER_MINUTES = suspendTimeToMinutes(result.timerSuspend) ?? 30;

  console.log("🔔 Suspend after minutes:", SUSPEND_AFTER_MINUTES);

  chrome.tabs.query({}, (tabs) => {
    tabs.forEach((tab) => {
      const tabId = tab.id;
      if (typeof tabId !== "number") return;

      if (
        !tab.url ||
        !tab.url.startsWith("http") ||
        tab.url.startsWith("chrome://")
      )
        return;

      if ((result.suspendPinnedTabs ?? true) && tab.pinned) return;
      if ((result.suspendActiveTab ?? true) && tab.active) return;
      if ((result.suspendAudioTabs ?? true) && tab.audible) return;

      const lastUsed = tab.lastAccessed ?? Date.now();
      const idleMinutes = (Date.now() - lastUsed) / 60000;

      console.log(
        `🔔 Tab ${tab.url} last accessed ${idleMinutes.toFixed(2)} minutes ago`
      );

      if (idleMinutes < SUSPEND_AFTER_MINUTES) return;

      if (result.suspendUnsavedInputs ?? true) {
        chrome.tabs.sendMessage(tabId, { action: "checkFormDirty" }, (res) => {
          if (chrome.runtime.lastError || res?.isDirty) {
            console.log(`❌ Tab ${tab.url} is dirty or errored. Skipping...`);
            return;
          }
          suspendTab(tab);
        });
      } else {
        suspendTab(tab);
      }
    });
  });
}

async function SuspendAllThoseTabsNow() {
  console.log("Suspening all those tabs now...");

  const result = await new Promise<any>((resolve) =>
    chrome.storage.local.get(
      [
        "suspendPinnedTabs",
        "suspendUnsavedInputs",
        "suspendActiveTab",
        "suspendAudioTabs",
      ],
      resolve
    )
  );

  chrome.tabs.query({}, (tabs) => {
    tabs.forEach((tab) => {
      const tabId = tab.id;
      if (typeof tabId !== "number") return;

      if (
        !tab.url ||
        !tab.url.startsWith("http") ||
        tab.url.startsWith("chrome://")
      )
        return;

      if ((result.suspendPinnedTabs ?? true) && tab.pinned) return;
      if ((result.suspendActiveTab ?? true) && tab.active) return;
      if ((result.suspendAudioTabs ?? true) && tab.audible) return;

      const lastUsed = tab.lastAccessed ?? Date.now();
      const idleMinutes = (Date.now() - lastUsed) / 60000;

      console.log(
        `🔔 Tab ${tab.url} last accessed ${idleMinutes.toFixed(2)} minutes ago`
      );

      if (result.suspendUnsavedInputs ?? true) {
        chrome.tabs.sendMessage(tabId, { action: "checkFormDirty" }, (res) => {
          if (chrome.runtime.lastError || res?.isDirty) {
            console.log(`❌ Tab ${tab.url} is dirty or errored. Skipping...`);
            return;
          }
          suspendTab(tab);
        });
      } else {
        suspendTab(tab);
      }
    });
  });
}

async function closeSuspendedTabsAlarm() {
  const result = await new Promise<any>((resolve) =>
    chrome.storage.local.get(["timerAutoCloseSuspend"], resolve)
  );
  if (
    !result.timerAutoCloseSuspend ||
    result.timerAutoCloseSuspend === "never"
  ) {
    console.log("🔔 No suspension timer set. Skipping...");
    return;
  }

  console.log("🔔 Closing all suspended tabs...");
  closeAllSuspendedTabs();
}

async function AutoCloseTabsAlarm() {
  const result = await new Promise<any>((resolve) =>
    chrome.storage.local.get(
      [
        "timerAutoCloseTabs",
        "closePinnedTabs",
        "closeUnsavedInputs",
        "closeActiveTab",
        "closeAudioTabs",
      ],
      resolve
    )
  );

  if (!result.timerAutoCloseTabs || result.timerAutoCloseTabs === "never") {
    console.log("🔔 No auto tab close timer set. Skipping...");
    return;
  }
  console.log("🔔 Checking closing idle tabs...");

  const AUTO_CLOSE_MINUTES =
    suspendTimeToMinutes(result.timerAutoCloseTabs) ?? 30;
  chrome.tabs.query({}, (tabs) => {
    for (const tab of tabs) {
      const tabId = tab.id;
      if (typeof tabId !== "number") continue;

      if (
        !tab.url ||
        !tab.url.startsWith("http") ||
        tab.url.startsWith("chrome://")
      )
        continue;

      if ((result.closePinnedTabs ?? true) && tab.pinned) continue;
      if ((result.closeActiveTab ?? true) && tab.active) continue;
      if ((result.closeAudioTabs ?? true) && tab.audible) continue;

      console.log("🔔 Tab is eligible for auto close:", tab.url);

      const lastUsed = tab.lastAccessed ?? Date.now();
      const idleMinutes = (Date.now() - lastUsed) / 60000;

      console.log(
        `🔔 Tab ${tab.url} last accessed ${idleMinutes.toFixed(2)} minutes ago`
      );

      if (idleMinutes < AUTO_CLOSE_MINUTES) continue;

      if (result.closeUnsavedInputs ?? true) {
        chrome.tabs.sendMessage(tabId, { action: "checkFormDirty" }, (res) => {
          if (chrome.runtime.lastError || res?.isDirty) {
            console.log(`❌ Tab ${tab.url} is dirty or errored. Skipping...`);
            return;
          }
          chrome.tabs.remove(tabId, () => {
            console.log(
              `🔔 Closed tab ${tab.url} after ${idleMinutes.toFixed(2)} minutes`
            );
          });
        });
      } else {
        chrome.tabs.remove(tabId, () => {
          console.log(
            `🔔 Closed tab ${tab.url} after ${idleMinutes.toFixed(2)} minutes`
          );
        });
      }
    }
  });
}

async function CloseThoseTabsNow() {
  console.log("Closing all those tabs now...");
  const result = await new Promise<any>((resolve) =>
    chrome.storage.local.get(
      [
        "closePinnedTabs",
        "closeUnsavedInputs",
        "closeActiveTab",
        "closeAudioTabs",
      ],
      resolve
    )
  );

  chrome.tabs.query({}, (tabs) => {
    for (const tab of tabs) {
      const tabId = tab.id;
      if (typeof tabId !== "number") continue;

      if (
        !tab.url ||
        !tab.url.startsWith("http") ||
        tab.url.startsWith("chrome://")
      )
        continue;

      if ((result.closePinnedTabs ?? true) && tab.pinned) continue;
      if ((result.closeActiveTab ?? true) && tab.active) continue;
      if ((result.closeAudioTabs ?? true) && tab.audible) continue;

      console.log("🔔 Tab is eligible for auto close:", tab.url);

      const lastUsed = tab.lastAccessed ?? Date.now();
      const idleMinutes = (Date.now() - lastUsed) / 60000;

      console.log(
        `🔔 Tab ${tab.url} last accessed ${idleMinutes.toFixed(2)} minutes ago`
      );

      if (result.closeUnsavedInputs ?? true) {
        chrome.tabs.sendMessage(tabId, { action: "checkFormDirty" }, (res) => {
          if (chrome.runtime.lastError || res?.isDirty) {
            console.log(`❌ Tab ${tab.url} is dirty or errored. Skipping...`);
            return;
          }
          chrome.tabs.remove(tabId, () => {
            console.log(
              `🔔 Closed tab ${tab.url} after ${idleMinutes.toFixed(2)} minutes`
            );
          });
        });
      } else {
        chrome.tabs.remove(tabId, () => {
          console.log(
            `🔔 Closed tab ${tab.url} after ${idleMinutes.toFixed(2)} minutes`
          );
        });
      }
    }
  });
}

function suspendTab(tab: chrome.tabs.Tab) {
  const encodedUrl = encodeURIComponent(tab.url ?? "");
  const encodedTitle = encodeURIComponent(tab.title ?? "Sleeping Tab");
  const encodedFavicon = encodeURIComponent(tab.favIconUrl ?? "");

  const suspendUrl =
    chrome.runtime.getURL("suspended.html") +
    `#url=${encodedUrl}&title=${encodedTitle}&favicon=${encodedFavicon}`;

  chrome.tabs.update(tab.id!, { url: suspendUrl });
}

function suspendTimeToMinutes(value: string): number | null {
  if (value === "never") return null;

  const num = parseInt(value);
  if (value.endsWith("s")) return num / 60;
  if (value.endsWith("m")) return num;
  if (value.endsWith("h")) return num * 60;
  if (value.endsWith("d")) return num * 60 * 24;
  if (value.endsWith("w")) return num * 60 * 24 * 7;

  return null;
}

function closeAllSuspendedTabs() {
  chrome.tabs.query({}, (tabs) => {
    for (const tab of tabs) {
      if (
        tab.url?.startsWith("chrome-extension://") ||
        tab.url?.startsWith("moz-extension://")
      ) {
        if (tab.url.includes("suspended.html") && tab.id !== undefined) {
          chrome.tabs.remove(tab.id);
        }
      }
    }
  });
}

// OTHER UTILITY FUNCTIONS >>>>>>>>>>>>>>>>>>>>>>>>>>>
// OTHER UTILITY FUNCTIONS >>>>>>>>>>>>>>>>>>>>>>>>>>>
// OTHER UTILITY FUNCTIONS >>>>>>>>>>>>>>>>>>>>>>>>>>>
// OTHER UTILITY FUNCTIONS >>>>>>>>>>>>>>>>>>>>>>>>>>>
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
        // ... other Toastify options ...
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
        // ... other Toastify options ...
      }).showToast();
      // automateTableResponses(defaultSettingsPBM);
    });

    const buttonEmpty = document.createElement("button");
    buttonEmpty.className = "btn btn-danger ml-2";
    buttonEmpty.textContent = "Clear";
    buttonEmpty.addEventListener("click", () => {
      const radioInputs: NodeListOf<HTMLInputElement> =
        document.querySelectorAll('.table input[type="radio"]');

      // Iterate through each radio input and uncheck it
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
        // ... other Toastify options ...
      }).showToast();
    });

    const txt = document.createElement("p");
    txt.className = "bg-info text-white mr-2";
    txt.textContent = "SiAp DiPS ~> automate eval PBM 〜(￣▽￣〜)";

    // selectAllDosenCheckbox.addEventListener("change", function () {
    //   autoSubmitCheckbox.checked = this.checked;
    // });

    // Append elements to the container
    container.appendChild(txt); // TEXT KIRI

    container.appendChild(autoSubmitCheckbox);
    container.appendChild(autoSubmitLabel);

    container.appendChild(button);

    container.appendChild(buttonAll);

    container.appendChild(buttonEmpty);

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

interface Course {
  mataKuliah: string;
  ruang: string;
  waktuMulai: string;
  waktuSelesai: string;
  sks: number;
  msTeams: string;
}

interface DayObject {
  [dayName: string]: Course[];
}

function parseTableToJsonAndSave(): DayObject | null {
  const table = document.querySelector(".table") as HTMLTableElement | null;
  if (!table) {
    console.error("Elemen tabel tidak ditemukan.");
    return null;
  }

  const tbody = table.querySelector("tbody") as HTMLTableSectionElement | null;
  if (!tbody) {
    console.error("Body tabel (tbody) tidak ditemukan.");
    return null;
  }

  const rows: HTMLTableRowElement[] = Array.from(
    tbody.querySelectorAll("tr")
  ) as HTMLTableRowElement[];
  if (!rows || rows.length === 0) {
    console.warn("Tidak ada baris tabel yang ditemukan di tbody.");
    return {}; // Kembalikan objek kosong jika tidak ada baris
  }

  const daysSchedule: DayObject = {}; // Inisialisasi sebagai objek tunggal
  let currentDay: string | null = null;
  let dayCourses: Course[] = [];

  rows.forEach((row) => {
    const cells: HTMLElement[] = Array.from(
      row.querySelectorAll("td")
    ) as HTMLElement[];

    if (cells.length >= 8) {
      // const rowNumber = cells[0].textContent?.trim() || "";
      const day = cells[1].textContent?.trim() || "";
      const mataKuliah = cells[2].textContent?.trim() || "";
      const ruang = cells[3].textContent?.trim() || "";
      const waktuText = cells[4].textContent?.trim() || "";
      const sksText = cells[5].textContent?.trim() || "";
      // cells[6] diabaikan ('Hadir')
      // cells[7] diabaikan ('Aksi')
      const msTeams =
        (cells[7]?.children?.[1] as HTMLAnchorElement)?.href || "";

      if (day) {
        if (day !== currentDay) {
          if (currentDay) {
            daysSchedule[currentDay] = dayCourses; // Langsung menetapkan array kursus ke hari sebagai key
          }
          currentDay = day;
          dayCourses = [];
        }

        const waktuParts = waktuText.split(" s/d ");
        const waktuMulai = waktuParts[0];
        const waktuSelesai = waktuParts[1];

        const sks = parseFloat(sksText);

        dayCourses.push({
          mataKuliah: mataKuliah,
          ruang: ruang,
          waktuMulai: waktuMulai,
          waktuSelesai: waktuSelesai,
          sks: sks,
          msTeams: msTeams,
        });
      }
    }
  });

  // Menambahkan kursus hari terakhir
  if (currentDay) {
    daysSchedule[currentDay] = dayCourses; // Langsung menetapkan array kursus ke hari terakhir
  }

  // Simpan ke Chrome Local Storage
  chrome.storage.local.set({ scheduleData: daysSchedule }, function () {
    if (chrome.runtime.lastError) {
      console.error(
        "Error menyimpan ke Chrome local storage:",
        chrome.runtime.lastError
      );
    } else {
      // console.log("Data jadwal disimpan ke Chrome local storage.");
      // Verifikasi data yang disimpan (opsional)
      chrome.storage.local.get(["scheduleData"], function (result) {
        console.log("data Chrome local storage:", result.scheduleData);
      });
    }
  });

  return daysSchedule; // Mengembalikan objek tunggal
}
