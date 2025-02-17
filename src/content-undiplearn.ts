import { createHelperDefault } from "@/lib/content_undiplearn";

// START

// @ts-ignore
Toastify({
  text: "SiAp DiPS ~> Welcome ヽ（≧□≦）ノ",
  duration: 3000,
  close: true,
  position: "right",
}).showToast();

console.log("Hello Undiplearn");

// START

//  ++++++++++++++++++++++++++++++++++++++++++++++++
window.addEventListener("load", () => {
  createHelperDefault();
});
