// A button configuration interface, with an optional async action.
interface ButtonConfig {
  text: string;
  icon: string;
  primary?: boolean;
  action?: () => Promise<void> | void;
}

function klik(e: string) {
  const el = document.querySelector(e);
  el?.dispatchEvent(new Event("mousedown", { bubbles: true }));
  el?.dispatchEvent(new Event("pointerdown", { bubbles: true }));
  el?.dispatchEvent(new Event("mouseup", { bubbles: true }));
}

const BUTTONS: ButtonConfig[] = [
  {
    text: "Pilgan Full",
    icon: "🅰️",
    action: TogglePilganFull(),
    primary: true,
  },
  {
    text: "Dropdown FULL",
    icon: "🦖",
    action: ToggleDropdownFull(),
  },
  {
    text: "SelectWord FULL",
    icon: "🔍",
    action: ToggleSelectWordFull(),
  },
  {
    text: "Word Gap / true false FULL",
    icon: "🙏",
    action: ToggleWordGapFull(),
  },
  {
    text: "IsianTextBOx FULL",
    icon: "📝",
    action: ToggleIsianTextBoxFull(),
  },
  {
    text: "Pair Kanan Kiri FULL",
    icon: "🔗",
    action: TogglePairKiriKananFull(),
  },
  {
    text: "DUMMY",
    icon: "👻",
  },
  {
    text: "RESET",
    icon: "🔄",
    action: ResetAllFull(),
  },
];

function TogglePilganFull(): () => void {
  let observing = false;
  const observer = new MutationObserver((_mutations) => {
    if (!document.querySelector(".mcqItemStyle")) {
      observer.disconnect();
      observing = false;
      console.log("✅ Disconnected from the MutationObserver.");
      //   @ts-ignore
      Toastify({
        text: "ERROR ~> Gk ketemu",
        duration: 3000,
        close: true,
        position: "right",
      }).showToast();
      return;
    }
    console.log("✅ Found PILGAN FULL!");

    console.log("ABCD~~~");

    klik(".mcqItemStyle");
    klik(".check");

    klik("#resetButton");

    klik(".reveal");

    const selectableElements = document.querySelectorAll(
      ".mcqItemStyle-selected"
    );
    const uniqueSelectors = Array.from(selectableElements).map(
      (element, index) => {
        const uniqueDataAttribute = `temp-unique-id-${index}`;
        element.setAttribute("data-unique", uniqueDataAttribute);
        return `[data-unique="${uniqueDataAttribute}"]`;
      }
    );
    klik(".reset");
    for (const selector of uniqueSelectors) {
      klik(selector);
    }

    klik(".check");
    klik("#navbarRightButton");
    if (document.querySelector(".scoringPageBackground")) {
      observer.disconnect();
      observing = false;
      console.log("✅ Disconnected from the MutationObserver.");
      //   @ts-ignore
      Toastify({
        text: "DONE ~> AUTO PILGAN FULL",
        duration: 3000,
        close: true,
        position: "right",
      }).showToast();
    }
  });

  return () => {
    if (!observing) {
      // @ts-ignore
      Toastify({
        text: "AUTO PILGAN FULL",
        duration: 3000,
        close: true,
        position: "right",
      }).showToast();
      observer.observe(document.body, {
        childList: true,
        subtree: true,
      });
      observing = true;
      console.log("🔍 MutationObserver started.");
    } else {
      observer.disconnect();
      observing = false;
      console.log("❌ MutationObserver stopped.");
    }
  };
}

function ToggleDropdownFull(): () => void {
  let observing = false;
  const observer = new MutationObserver((_mutations) => {
    if (!document.querySelector(".dropDownBox")) {
      observer.disconnect();
      observing = false;
      console.log("✅ Disconnected from the MutationObserver.");
      //   @ts-ignore
      Toastify({
        text: "ERROR ~> Gk ketemu",
        duration: 3000,
        close: true,
        position: "right",
      }).showToast();
      return;
    }
    // MAIN
    console.log("✅ Found DROPDOWN FULL!");

    (document.querySelector(".dropDownBox") as HTMLInputElement).value = (
      document.querySelectorAll(".option")[1] as HTMLInputElement
    ).value;

    klik(".check");
    klik(".reveal");

    const dropdowns = document.querySelectorAll(
      ".dropDownBox"
    ) as NodeListOf<HTMLInputElement>;
    const jawaban: string[] = [];

    dropdowns.forEach((dropdown) => {
      const selectedValue = dropdown.value;
      jawaban.push(selectedValue);
    });
    console.log(jawaban);

    klik(".reset");

    const dropdownsBaru = document.querySelectorAll(
      ".dropDownBox"
    ) as NodeListOf<HTMLInputElement>;
    for (let i = 0; i < dropdownsBaru.length; i++) {
      dropdownsBaru[i].value = jawaban[i];
    }

    klik(".check");
    klik("#navbarRightButton");
    // MAIN

    if (document.querySelector(".scoringPageBackground")) {
      observer.disconnect();
      observing = false;
      console.log("✅ Disconnected from the MutationObserver.");
      //   @ts-ignore
      Toastify({
        text: "DONE ~> AUTO DROPDOWN FULL",
        duration: 3000,
        close: true,
        position: "right",
      }).showToast();
    }
  });

  return () => {
    if (!observing) {
      // @ts-ignore
      Toastify({
        text: "AUTO DROPDOWN FULL",
        duration: 3000,
        close: true,
        position: "right",
      }).showToast();
      observer.observe(document.body, {
        childList: true,
        subtree: true,
      });
      observing = true;
      console.log("🔍 MutationObserver started.");
    } else {
      observer.disconnect();
      observing = false;
      console.log("❌ MutationObserver stopped.");
    }
  };
}

function ToggleSelectWordFull(): () => void {
  let observing = false;
  const observer = new MutationObserver((_mutations) => {
    if (!document.querySelector(".wordSelect-Selectable")) {
      observer.disconnect();
      observing = false;
      console.log("✅ Disconnected from the MutationObserver.");
      //   @ts-ignore
      Toastify({
        text: "ERROR ~> Gk ketemu",
        duration: 3000,
        close: true,
        position: "right",
      }).showToast();
      return;
    }
    // MAIN
    console.log("✅ Found SelectWord FULL!");

    klik(".wordSelect-Selectable");
    klik(".check");
    klik(".reveal");

    const selectableElements = document.querySelectorAll(
      ".wordSelect-Selectable"
    );
    const filteredElements = Array.from(selectableElements).filter(
      (element) => {
        const nextSibling = element.nextElementSibling;
        const previousSibling = element.previousElementSibling;
        return (
          (nextSibling && nextSibling.classList.contains("markContainer")) ||
          (previousSibling &&
            previousSibling.classList.contains("markContainer"))
        );
      }
    );
    const uniqueSelectors = filteredElements.map((element, index) => {
      const uniqueDataAttribute = `temp-unique-id-${index}`;
      element.setAttribute("data-unique", uniqueDataAttribute);
      return `[data-unique="${uniqueDataAttribute}"]`;
    });

    klik(".reset");

    for (const selector of uniqueSelectors) {
      klik(selector);
    }

    klik(".check");
    klik("#navbarRightButton");
    // MAIN

    if (document.querySelector(".scoringPageBackground")) {
      observer.disconnect();
      observing = false;
      console.log("✅ Disconnected from the MutationObserver.");
      //   @ts-ignore
      Toastify({
        text: "DONE ~> AUTO SelectWord FULL",
        duration: 3000,
        close: true,
        position: "right",
      }).showToast();
    }
  });

  return () => {
    if (!observing) {
      // @ts-ignore
      Toastify({
        text: "AUTO SelectWord FULL",
        duration: 3000,
        close: true,
        position: "right",
      }).showToast();
      observer.observe(document.body, {
        childList: true,
        subtree: true,
      });
      observing = true;
      console.log("🔍 MutationObserver started.");
    } else {
      observer.disconnect();
      observing = false;
      console.log("❌ MutationObserver stopped.");
    }
  };
}

function ToggleWordGapFull(): () => void {
  let observing = false;
  const observer = new MutationObserver((_mutations) => {
    if (
      !document.querySelector(".mcqInlineItem") &&
      !document.querySelector(".mcqAlignedItem")
    ) {
      observer.disconnect();
      observing = false;
      console.log("✅ Disconnected from the MutationObserver.");
      //   @ts-ignore
      Toastify({
        text: "ERROR ~> Gk ketemu",
        duration: 3000,
        close: true,
        position: "right",
      }).showToast();
      return;
    }
    // MAIN
    console.log("✅ Found Word Gap FULL!");

    let itemAligned = "";

    if (document.querySelector(".mcqInlineItem"))
      itemAligned = ".mcqInlineItem";
    if (document.querySelector(".mcqAlignedItem"))
      itemAligned = ".mcqAlignedItem";

    klik(itemAligned);

    klik(".check");
    klik(".reveal");

    const selectableElements = document.querySelectorAll(
      `${itemAligned}-selected`
    );

    const uniqueSelectors = Array.from(selectableElements).map(
      (element, index) => {
        const uniqueDataAttribute = `temp-unique-id-${index}`;
        element.setAttribute("data-unique", uniqueDataAttribute);
        return `[data-unique="${uniqueDataAttribute}"]`;
      }
    );

    klik(".reset");

    for (const selector of uniqueSelectors) {
      klik(selector);
    }

    klik(".check");
    klik("#navbarRightButton");
    // MAIN

    if (document.querySelector(".scoringPageBackground")) {
      observer.disconnect();
      observing = false;
      console.log("✅ Disconnected from the MutationObserver.");
      //   @ts-ignore
      Toastify({
        text: "DONE ~> AUTO Word Gap FULL",
        duration: 3000,
        close: true,
        position: "right",
      }).showToast();
    }
  });

  return () => {
    if (!observing) {
      // @ts-ignore
      Toastify({
        text: "AUTO Word Gap FULL",
        duration: 3000,
        close: true,
        position: "right",
      }).showToast();
      observer.observe(document.body, {
        childList: true,
        subtree: true,
      });
      observing = true;
      console.log("🔍 MutationObserver started.");
    } else {
      observer.disconnect();
      observing = false;
      console.log("❌ MutationObserver stopped.");
    }
  };
}

function ToggleIsianTextBoxFull(): () => void {
  let observing = false;
  const observer = new MutationObserver((_mutations) => {
    if (!document.querySelector(".textEntry-textBox")) {
      observer.disconnect();
      observing = false;
      console.log("✅ Disconnected from the MutationObserver.");
      //   @ts-ignore
      Toastify({
        text: "ERROR ~> Gk ketemu",
        duration: 3000,
        close: true,
        position: "right",
      }).showToast();
      return;
    }
    // MAIN
    console.log("✅ Found IsianTextBOx FULL!");

    klik(".textEntry-textBox");
    (document.querySelector(".textEntry-textBox") as HTMLInputElement).value =
      "myudak";

    klik(".check");
    klik(".reveal");

    const textBoxes = document.querySelectorAll(
      ".textEntry-textBox"
    ) as NodeListOf<HTMLInputElement>;
    const jawaban: string[] = [];

    textBoxes.forEach((textBox) => {
      const selectedValue = textBox.value;
      jawaban.push(selectedValue);
    });

    console.log(jawaban);

    klik(".reset");

    const textBoxesBaru = document.querySelectorAll(
      ".textEntry-textBox"
    ) as NodeListOf<HTMLInputElement>;
    for (let i = 0; i < textBoxesBaru.length; i++) {
      textBoxesBaru[i].value = jawaban[i];
    }

    klik(".check");
    klik("#navbarRightButton");
    // MAIN

    if (document.querySelector(".scoringPageBackground")) {
      observer.disconnect();
      observing = false;
      console.log("✅ Disconnected from the MutationObserver.");
      //   @ts-ignore
      Toastify({
        text: "DONE ~> AUTO IsianTextBOx FULL",
        duration: 3000,
        close: true,
        position: "right",
      }).showToast();
    }
  });

  return () => {
    if (!observing) {
      // @ts-ignore
      Toastify({
        text: "AUTO IsianTextBOx FULL",
        duration: 3000,
        close: true,
        position: "right",
      }).showToast();
      observer.observe(document.body, {
        childList: true,
        subtree: true,
      });
      observing = true;
      console.log("🔍 MutationObserver started.");
    } else {
      observer.disconnect();
      observing = false;
      console.log("❌ MutationObserver stopped.");
    }
  };
}

function TogglePairKiriKananFull(): () => void {
  let observing = false;
  const observer = new MutationObserver((_mutations) => {
    if (!document.querySelector(".pendingPair")) {
      observer.disconnect();
      observing = false;
      console.log("✅ Disconnected from the MutationObserver.");
      //   @ts-ignore
      Toastify({
        text: "ERROR ~> Gk ketemu",
        duration: 3000,
        close: true,
        position: "right",
      }).showToast();
      return;
    }
    // MAIN
    console.log("✅ Found pairKananKiri FULL!");

    const a: string[] = [];
    const elements = Array.from(
      document.querySelectorAll<HTMLElement>(".pendingPair")
    )
      .map((element) => ({
        element,
        origId: element.getAttribute("orig_id") || "",
      }))
      .sort((a, b) => a.origId.localeCompare(b.origId));

    elements.forEach((item, index) => {
      item.element.setAttribute("unique_id", `unique_${index + 1}`);
      a.push(`[unique_id="unique_${index + 1}"]`);
    });

    console.log("JAWABANN ~~>", a);

    for (const selector of a) {
      klik(selector);
    }

    klik(".check");
    klik("#navbarRightButton");
    // MAIN

    if (document.querySelector(".scoringPageBackground")) {
      observer.disconnect();
      observing = false;
      console.log("✅ Disconnected from the MutationObserver.");
      //   @ts-ignore
      Toastify({
        text: "DONE ~> AUTO pairKananKiri FULL",
        duration: 3000,
        close: true,
        position: "right",
      }).showToast();
    }
  });

  return () => {
    if (!observing) {
      // @ts-ignore
      Toastify({
        text: "AUTO pairKananKiri FULL",
        duration: 3000,
        close: true,
        position: "right",
      }).showToast();
      observer.observe(document.body, {
        childList: true,
        subtree: true,
      });
      observing = true;
      console.log("🔍 MutationObserver started.");
    } else {
      observer.disconnect();
      observing = false;
      console.log("❌ MutationObserver stopped.");
    }
  };
}

function ResetAllFull(): () => void {
  let observing = false;
  let kaliGkKetemu = 0;
  const observer = new MutationObserver((_mutations) => {
    console.log(document.querySelector(".reset"));
    if (!document.querySelector(".reset")) {
      kaliGkKetemu++;
    }
    if (kaliGkKetemu > 10) {
      observer.disconnect();
      observing = false;
      kaliGkKetemu = 0;
      console.log("✅ Disconnected from the MutationObserver.");
      //   @ts-ignore
      Toastify({
        text: "ERROR ~> Kali gk ketemu",
        duration: 3000,
        close: true,
        position: "right",
      }).showToast();
      return;
    }
    if (document.querySelector(".reset")) {
      klik(".reset");
    }
    klik("#navbarRightButton");
    // MAIN

    // MAIN
  });

  return () => {
    if (!observing) {
      // @ts-ignore
      Toastify({
        text: "AUTO RESET FULL",
        duration: 3000,
        close: true,
        position: "right",
      }).showToast();
      observer.observe(document.body, {
        childList: true,
        subtree: true,
      });
      observing = true;
      console.log("🔍 MutationObserver started.");
    } else {
      observer.disconnect();
      observing = false;
      kaliGkKetemu = 0;
      console.log("❌ MutationObserver stopped.");
    }
  };
}

export { BUTTONS, TogglePilganFull };
