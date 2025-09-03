/* eslint-disable @typescript-eslint/no-unused-vars */
import path from "path";
import { defineConfig } from "vite";

export default defineConfig(({ mode }) => ({
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    rollupOptions: {
      input: "src/content-job.ts", // Only build content script
      output: {
        entryFileNames: "content-job.js", // Keep the output filename consistent
        format: "iife", // Chrome Extensions require IIFE format
      },
    },
    outDir: "public", // Output directory
    emptyOutDir: false, // Prevent clearing the dist folder (so main build files remain)
  },
}));
