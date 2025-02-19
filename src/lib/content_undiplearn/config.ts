// A button configuration interface, with an optional async action.
interface ButtonConfig {
  text: string;
  icon: string;
  primary?: boolean;
  action?: () => Promise<void> | void;
}

function klikClass(e: string) {
  const el = document.querySelector(e);
  el?.dispatchEvent(new Event("mousedown", { bubbles: true }));
  el?.dispatchEvent(new Event("pointerdown", { bubbles: true }));
  el?.dispatchEvent(new Event("mouseup", { bubbles: true }));
}

function klikElement(e: Element) {
  e.dispatchEvent(new Event("mousedown", { bubbles: true }));
  e.dispatchEvent(new Event("pointerdown", { bubbles: true }));
  e.dispatchEvent(new Event("mouseup", { bubbles: true }));
}

const BUTTONS: ButtonConfig[] = [
  {
    text: "AUTO THIS",
    icon: "🔥",
    primary: true,
  },
  {
    text: "Pilgan",
    icon: "🅰️",
    action: TogglePilganFull(),
  },
  {
    text: "Dropdown",
    icon: "🦖",
    action: ToggleDropdownFull(),
  },
  {
    text: "SelectWord",
    icon: "🔍",
    action: ToggleSelectWordFull(),
  },
  {
    text: "Word Gap / true false",
    icon: "🙏",
    action: ToggleWordGapFull(),
  },
  {
    text: "IsianTextBOx",
    icon: "📝",
    action: ToggleIsianTextBoxFull(),
  },
  {
    text: "Pair Kanan Kiri",
    icon: "🔗",
    action: TogglePairKiriKananFull(),
  },
  {
    text: "Item Bank Drag & Drop",
    icon: "👾",
    action: ToggleWeb(
      ToggleItemBankDragDrop(),
      ".dndSentenceItem",
      "Item Bank Drag & Drop"
    ),
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

    klikClass(".mcqItemStyle");
    klikClass(".check");

    klikClass("#resetButton");

    klikClass(".reveal");

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
    klikClass(".reset");
    for (const selector of uniqueSelectors) {
      klikClass(selector);
    }

    klikClass(".check");
    klikClass("#navbarRightButton");
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

    klikClass(".check");
    klikClass(".reveal");

    const dropdowns = document.querySelectorAll(
      ".dropDownBox"
    ) as NodeListOf<HTMLInputElement>;
    const jawaban: string[] = [];

    dropdowns.forEach((dropdown) => {
      const selectedValue = dropdown.value;
      jawaban.push(selectedValue);
    });
    console.log(jawaban);

    klikClass(".reset");

    const dropdownsBaru = document.querySelectorAll(
      ".dropDownBox"
    ) as NodeListOf<HTMLInputElement>;
    for (let i = 0; i < dropdownsBaru.length; i++) {
      dropdownsBaru[i].value = jawaban[i];
    }

    klikClass(".check");
    klikClass("#navbarRightButton");
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

    klikClass(".wordSelect-Selectable");
    klikClass(".check");
    klikClass(".reveal");

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

    klikClass(".reset");

    for (const selector of uniqueSelectors) {
      klikClass(selector);
    }

    klikClass(".check");
    klikClass("#navbarRightButton");
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

    klikClass(itemAligned);

    klikClass(".check");
    klikClass(".reveal");

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

    klikClass(".reset");

    for (const selector of uniqueSelectors) {
      klikClass(selector);
    }

    klikClass(".check");
    klikClass("#navbarRightButton");
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

    klikClass(".textEntry-textBox");
    (document.querySelector(".textEntry-textBox") as HTMLInputElement).value =
      "myudak";

    klikClass(".check");
    klikClass(".reveal");

    const textBoxes = document.querySelectorAll(
      ".textEntry-textBox"
    ) as NodeListOf<HTMLInputElement>;
    const jawaban: string[] = [];

    textBoxes.forEach((textBox) => {
      const selectedValue = textBox.value;
      jawaban.push(selectedValue);
    });

    console.log(jawaban);

    klikClass(".reset");

    const textBoxesBaru = document.querySelectorAll(
      ".textEntry-textBox"
    ) as NodeListOf<HTMLInputElement>;
    for (let i = 0; i < textBoxesBaru.length; i++) {
      textBoxesBaru[i].value = jawaban[i];
    }

    klikClass(".check");
    klikClass("#navbarRightButton");
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
      klikClass(selector);
    }

    klikClass(".check");
    klikClass("#navbarRightButton");
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

function ToggleItemBankDragDrop(): () => void {
  return () => {
    // MAIN
    console.log("✅ Found ITEM BANCK!");

    const AllDrop = document.querySelectorAll(
      ".dndDropSentencePanel.dragdrop-dropTarget"
    );

    klikClass(".dndSentenceItem");
    klikClass(".dndDropSentencePanel.dragdrop-dropTarget");
    klikClass(".check");
    klikClass(".reveal");

    const AllJawabanElement = document.querySelectorAll(
      ".dndSentenceItem.dndSentenceItem-dndSentenceItemDropped"
    );

    let AllJawaban: string[] = [];

    AllJawabanElement.forEach((item) => {
      AllJawaban.push(item.textContent || "");
    });

    klikClass(".reset");

    console.log("AllJawaban", AllJawaban);
    console.log("AllDrop", AllDrop);

    AllJawaban.forEach((item, i) => {
      const elements = document.querySelectorAll(
        ".dndSentenceItem"
      ) as NodeListOf<HTMLElement>;
      const targetElement = Array.from(elements).find(
        (el) => el.innerText.trim() === item
      );
      if (!targetElement) return;
      klikElement(targetElement);
      klikElement(AllDrop[i]);
    });

    klikClass(".check");
    klikClass("#navbarRightButton");
    // MAIN
  };
}

function ToggleWeb(f: () => void, classAwal: string, name: string) {
  let observing = false;
  const observer = new MutationObserver((_mutations) => {
    if (!document.querySelector(classAwal)) {
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
    f();
    // MAIN

    if (document.querySelector(".scoringPageBackground")) {
      observer.disconnect();
      observing = false;
      console.log("✅ Disconnected from the MutationObserver.");
      //   @ts-ignore
      Toastify({
        text: `DONE ~> AUTO ${name}`,
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
        text: `AUTO ${name}`,
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
      klikClass(".reset");
    }
    klikClass("#navbarRightButton");
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
