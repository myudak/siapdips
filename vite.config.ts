import path from "path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import fs from "fs";
import CleanCSS from "clean-css";
import flattenOutput from "vite-plugin-flatten-output";
import { viteStaticCopy } from "vite-plugin-static-copy";

export default defineConfig(() => {
  // MINIFIED mode CSS ========
  const cssPath = path.resolve(__dirname, "src/mode.css");
  const cssContent = fs.readFileSync(cssPath, "utf-8");
  const minified = new CleanCSS().minify(cssContent).styles;
  const minifiedPath = path.resolve(__dirname, "public/mode.min.css");
  fs.writeFileSync(minifiedPath, minified, "utf-8");
  // MINIFIED mode CSS ========

  return {
    plugins: [
      react(),
      viteStaticCopy({
        targets: [{ src: "src/manifest.json", dest: "." }],
      }),
      flattenOutput({
        removeDirs: ["src/pages/main", "src/pages/option"],
        filePattern: ".html",
      }),
    ],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    build: {
      rollupOptions: {
        input: {
          popup: path.resolve(__dirname, "src/pages/main/popup.html"),
          nested: path.resolve(__dirname, "src/pages/option/option.html"),
          content: path.resolve(__dirname, "src/content.js"),
          contentFt: path.resolve(__dirname, "src/content-ft.js"),
          background: path.resolve(__dirname, "src/background.ts"),
          "content-moodle": path.resolve(__dirname, "src/content-moodle.ts"),
        },
        output: {
          // manualChunks(id) {
          //   if (id.includes("src/content-undiplearn.ts")) {
          //     return "content-undiplearn";
          //   }
          // },

          entryFileNames: (chunkInfo) => {
            if (chunkInfo.name === "content") return "content.js";
            if (chunkInfo.name === "background") return "background.js";
            if (chunkInfo.name === "contentFt") return "content-ft.js";
            if (chunkInfo.name === "content-moodle") return "content-moodle.js";
            return "assets/[name]-[hash].js";
          },
          banner: `/*!
 * myudakk/SiapDips v1.0.0
 * Copyright (c) ${new Date().getFullYear()} myyudak
 * Licensed under the MIT License
 */`,
        },
      },
      emptyOutDir: true,
    },
  };
});
