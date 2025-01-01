import path from "path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
// @ts-ignore IGNORE KARENA VITE PLUGIN COPY GK AD TYPE
import { copy } from "vite-plugin-copy";

export default defineConfig({
  plugins: [
    react(),
    copy([
      { src: "src/manifest.json", dest: "dist" },
      { src: "src/mode.css", dest: "dist" },
    ]),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, "index.html"),
        nested: path.resolve(__dirname, "option.html"),
        content: path.resolve(__dirname, "src/content.js"),
        background: path.resolve(__dirname, "src/background.ts"),
      },
      output: {
        entryFileNames: (chunkInfo) => {
          if (chunkInfo.name === "content") return "content.js";
          if (chunkInfo.name === "background") return "background.js";
          return "assets/[name]-[hash].js";
        },
      },
    },
  },
});
