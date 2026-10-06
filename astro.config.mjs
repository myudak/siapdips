import react from "@astrojs/react";
import { defineConfig } from "astro/config";
import { viteStaticCopy } from "vite-plugin-static-copy";

export default defineConfig({
  site: "https://myudak.github.io",
  base: "/siapdips",
  integrations: [react()],
  srcDir: "./src/landing-astro",
  publicDir: "./src/landing-astro/public",
  outDir: "./dist-landing",
  vite: {
    plugins: [
      viteStaticCopy({
        targets: [
          {
            src: "public/icons/icon48.png",
            dest: "icons",
          },
          {
            src: "public/icons/icon128.png",
            dest: "icons",
          },
          {
            src: "public/video/*.mp4",
            dest: "video",
          },
          {
            src: "public/images/chrome-store.png",
            dest: "images",
          },
          {
            src: "public/images/firefox-addons.jpg",
            dest: "images",
          },
          {
            src: "public/images/edge.png",
            dest: "images",
          },
        ],
      }),
    ],
  },
});
