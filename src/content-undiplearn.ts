import { createHelper } from "@/lib/content_undiplearn";

// START

// @ts-ignore
Toastify({
  text: "SiAp DiPS ~> Welcome ヽ（≧□≦）ノ",
  duration: 3000,
  close: true,
  position: "right",
  // ... other Toastify options ...
}).showToast();

console.log("Hello Undiplearn");

// START

//  ++++++++++++++++++++++++++++++++++++++++++++++++
function injectGlobalStyles() {
  const style = document.createElement("style");
  style.textContent = `
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
    .dragging {
      user-select: none;
      cursor: move;
    }
  `;
  document.head.appendChild(style);
}

window.addEventListener("load", () => {
  injectGlobalStyles();
  createHelper();
});
