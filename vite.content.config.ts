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
      input: "src/content-undiplearn.ts", // Only build content script
      output: {
        entryFileNames: "content-undiplearn.js", // Keep the output filename consistent
        format: "iife", // Chrome Extensions require IIFE format
      },
    },
    outDir: "dist", // Output directory
    emptyOutDir: false, // Prevent clearing the dist folder (so main build files remain)
  },
}));
