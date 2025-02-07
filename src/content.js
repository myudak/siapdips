function welcomeMsg(msg) {
  console.log(
    `\n%c${msg}`,
    "color:#0dd8d8; background:#0b1021; font-size:1.5rem; padding:0.15rem 0.25rem; margin: 1rem auto; font-family: Rockwell; border: 2px solid #0dd8d8; border-radius: 4px;font-weight: bold; text-shadow: 1px 1px 1px #00af87bf;"
  );
}
class SiapHandler {
  constructor() {
    this.ipkElements = new Map(); // Cache for IPK elements
    this.initialized = false;
    // Initialize immediately when DOM is ready
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", () => this.initialize());
    } else {
      this.initialize();
    }
  }

  // Initialize cache with IPK elements
  initialize() {
    if (this.initialized) return;

    // GET IPK
    const spans = document.querySelectorAll("span.text-muted");
    spans.forEach((span) => {
      if (span.textContent.trim() === "IPk" && span.nextElementSibling) {
        this.ipkElements.set(span.nextElementSibling, {
          element: span.nextElementSibling,
          isBlurred: false,
        });
      }
    });

    // GET USER PROFILE IMAGE
    const element = document.querySelector(".profile-image").childNodes[1];
    const backgroundImage = window.getComputedStyle(element).backgroundImage;

    // Use a regular expression to extract the URL
    const urlMatch = backgroundImage.match(/url\("([^"]+)"\)/);

    if (urlMatch) {
      const imageUrl = urlMatch[1];
      console.log(imageUrl);
      chrome.storage.local.set({ profileImage: imageUrl });

      chrome.storage.local.get("profileImageLocal").then((result) => {
        if (JSON.stringify(result) === "{}") {
          chrome.storage.local.set({ profileImageLocal: imageUrl });
        }
      });
    }

    // GET USER NAME
    const elementName = document.querySelector(".card-title").textContent;
    console.log(elementName);
    chrome.storage.local.set({ profileName: elementName });
    if (
      chrome.storage.local
        .get("profileNameLocal")
        .then((result) => JSON.stringify(result) === "{}")
    ) {
      chrome.storage.local.set({ profileNameLocal: elementName });
    }

    // GET USER NIM
    const elementNim =
      document.querySelectorAll("b")[0].nextElementSibling.textContent;
    console.log(elementNim);
    chrome.storage.local.set({ profileNim: elementNim });

    // GET USER PRODI
    const elementProdi =
      document.querySelectorAll("b")[0].nextElementSibling.nextElementSibling
        .nextSibling;
    console.log(elementProdi);
    chrome.storage.local.set({ profileProdi: elementProdi.textContent });

    this.initialized = true;
    console.log(
      "SIAP Handler initialized with",
      this.ipkElements.size,
      "elements"
    );

    if (this.ipkElements.size !== 0) {
      chrome.storage.local.set({ ipkDefault: this.collectData() });
    }

    chrome.storage.local.get("ipkLocal", (result) => {
      if (result.ipkLocal) {
        this.changeIpkData(result.ipkLocal);
      }
    });

    chrome.storage.local.get("isBlurred", (result) => {
      if (result.isBlurred) {
        this.toggleBlur(true);
      }
    });
  }

  // Toggle blur effect
  toggleBlur(blur = true) {
    if (!this.initialized) this.initialize();

    for (const [_, data] of this.ipkElements) {
      data.element.style.filter = blur ? "blur(5px)" : "none";
      data.element.style.transition = "filter 0.3s ease";
      data.isBlurred = blur;
    }
    chrome.storage.local.set({ isBlurred: blur });
  }

  changeIpkData(text) {
    if (!this.initialized) this.initialize();

    for (const [_, data] of this.ipkElements) {
      data.element.textContent = text;
    }
  }

  // Collect IPK data
  collectData() {
    if (!this.initialized) this.initialize();
    return Array.from(this.ipkElements.values()).map((data) =>
      data.element.textContent.trim()
    );
  }

  // Check if elements are blurred
  isBlurred() {
    if (!this.initialized) this.initialize();
    chrome.storage.local.get("isBlurred", (result) => {
      if (result.isBlurred) {
        this.toggleBlur(true);
      }
    });
    return Array.from(this.ipkElements.values()).some((data) => data.isBlurred)
      ? "true"
      : "";
  }
}

// Create and initialize the handler immediately
const ipkHandler = new SiapHandler();

// Message handler
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  try {
    switch (request.action) {
      case "blurIpkElement":
        ipkHandler.toggleBlur(true);
        break;
      case "undoBlurIpkElement":
        ipkHandler.toggleBlur(false);
        break;
      case "changeIpk":
        console.log(request.data);
        ipkHandler.changeIpkData(request.data);
        break;
      case "defaultIpk":
        sendResponse({
          status: "v4",
          ipkData: chrome.storage.local.get("ipkDefault"),
        });
        return;
      case "fetchIpkData":
        sendResponse({
          status: "v4",
          ipkData: ipkHandler.collectData(),
          isBlur: ipkHandler.isBlurred(),
        });
        return;
    }
    sendResponse({ status: "success" });
  } catch (error) {
    console.error("Error in SIAP handler:", error);
    sendResponse({ status: "error", message: error.message });
  }
});

// MAIN
welcomeMsg("Welcome Undipps.. 🚀");
