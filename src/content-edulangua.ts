import { createHelperDefault, runWithDisclaimer } from "@/lib/content_edulangua";

runWithDisclaimer(() => {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  Toastify({
    text: "Siedu by LutpyX powered by Siap Dips ~> Corrector for EduLangua (●ˇ∀ˇ●)",
    duration: 3000,
    close: true,
    position: "left",
  }).showToast();

  console.log("Hello EduLangua v1");

  createHelperDefault();
});

