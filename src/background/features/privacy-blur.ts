/**
 * Privacy blur functionality for sensitive information
 */

export function applyPrivacyBlur(tabId: number, url: string): void {
  // Don't apply blur on login page
  if (url.includes("https://sso.undip.ac.id/auth/user/login")) return;

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
        blurUsername(tabId);
      }
      if (data.isBlurredNim) {
        blurNim(tabId);
      }
      if (data.isBlurredAvatar) {
        blurAvatar(tabId);
      }
      if (data.isBlurredDosenWali) {
        blurDosenWali(tabId);
      }
      if (data.isBlurred) {
        blurIPK(tabId);
      }
    }
  );
}

function blurUsername(tabId: number): void {
  chrome.scripting.executeScript({
    target: { tabId },
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

function blurNim(tabId: number): void {
  chrome.scripting.executeScript({
    target: { tabId },
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

function blurAvatar(tabId: number): void {
  chrome.scripting.executeScript({
    target: { tabId },
    func: () => {
      const blurSelectors = [
        ".profile-image",
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

function blurDosenWali(tabId: number): void {
  chrome.scripting.executeScript({
    target: { tabId },
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

function blurIPK(tabId: number): void {
  chrome.scripting.executeScript({
    target: { tabId },
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
