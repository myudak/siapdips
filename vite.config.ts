import path from "path";
import react from "@vitejs/plugin-react";
import { defineConfig, type Plugin } from "vite";
import fs from "fs";
import CleanCSS from "clean-css";
import flattenOutput from "vite-plugin-flatten-output";

const ENTRY_FILE_BY_NAME = {
  content: "content.js",
  contentFt: "content-ft.js",
  "content-dyandra": "content-dyandra.js",
  contentOracleAcademy: "content-oracleAcademy.js",
  "content-moodle": "content-moodle.js",
  "content-form-watcher": "content-form-watcher.js",
  "content-undiplearn": "content-undiplearn.js",
  "content-absen": "content-absen.js",
  "content-job": "content-job.js",
  background: "background.js",
} as const;

const CONTENT_ENTRY_NAMES = new Set(
  Object.keys(ENTRY_FILE_BY_NAME).filter((entryName) => entryName !== "background")
);

const LEGACY_TO_ENTRY = Object.fromEntries(
  Object.entries(ENTRY_FILE_BY_NAME).map(([entryName, fileName]) => [
    fileName,
    entryName,
  ])
) as Record<string, keyof typeof ENTRY_FILE_BY_NAME>;

function resolveManifestTemplatePath(mode: string): string {
  if (mode === "firefox") {
    console.log("Using Firefox manifest template");
    return path.resolve(__dirname, "src/manifest-firefox.json");
  }

  if (mode === "edge") {
    console.log("Using Edge manifest template");
    return path.resolve(__dirname, "src/manifest-edge.json");
  }

  if (mode !== "chrome") {
    console.warn(
      "Build mode is not 'chrome', 'firefox', or 'edge'. Defaulting to Chrome manifest template."
    );
  } else {
    console.log("Using Chrome manifest template");
  }

  return path.resolve(__dirname, "src/manifest-chrome.json");
}

function rewriteManifestPlugin(mode: string): Plugin {
  return {
    name: "rewrite-manifest-to-built-entries",
    apply: "build",
    generateBundle(_, bundle) {
      const entryFileNames = new Map<string, string>();

      for (const outputFile of Object.values(bundle)) {
        if (outputFile.type === "chunk" && outputFile.isEntry) {
          entryFileNames.set(outputFile.name, outputFile.fileName);

          if (
            CONTENT_ENTRY_NAMES.has(outputFile.name) &&
            !outputFile.code.startsWith("import ") &&
            !outputFile.code.startsWith("export ")
          ) {
            outputFile.code = `(() => {\n${outputFile.code}\n})();`;
          }
        }
      }

      const resolveBuiltFile = (entryName: keyof typeof ENTRY_FILE_BY_NAME) => {
        const builtFileName = entryFileNames.get(entryName);
        if (!builtFileName) {
          this.error(
            `Missing built entry "${entryName}". Check rollup input configuration.`
          );
        }
        return builtFileName;
      };

      const templatePath = resolveManifestTemplatePath(mode);
      const template = fs.readFileSync(templatePath, "utf-8");
      const manifest = JSON.parse(template) as {
        background?: {
          service_worker?: string;
          scripts?: string[];
        };
        content_scripts?: Array<{
          js?: string[];
        }>;
      };

      if (manifest.background?.service_worker) {
        manifest.background.service_worker = resolveBuiltFile("background");
      }

      if (Array.isArray(manifest.background?.scripts)) {
        manifest.background.scripts = [resolveBuiltFile("background")];
      }

      for (const contentScript of manifest.content_scripts ?? []) {
        if (!Array.isArray(contentScript.js)) continue;

        contentScript.js = contentScript.js.map((scriptPath) => {
          const hasDotPrefix = scriptPath.startsWith("./");
          const normalizedScriptPath = hasDotPrefix
            ? scriptPath.slice(2)
            : scriptPath;

          const entryName = LEGACY_TO_ENTRY[normalizedScriptPath];
          if (!entryName) return scriptPath;

          const builtFileName = resolveBuiltFile(entryName);
          return hasDotPrefix ? `./${builtFileName}` : builtFileName;
        });
      }

      this.emitFile({
        type: "asset",
        fileName: "manifest.json",
        source: JSON.stringify(manifest, null, 2),
      });
    },
  };
}

export default defineConfig(({ mode }) => {
  // MINIFIED mode CSS ========
  const cssPath = path.resolve(__dirname, "src/mode.css");
  const cssContent = fs.readFileSync(cssPath, "utf-8");
  const minified = new CleanCSS().minify(cssContent).styles;
  const minifiedPath = path.resolve(__dirname, "public/mode.min.css");
  fs.writeFileSync(minifiedPath, minified, "utf-8");
  // MINIFIED mode CSS ========

  const PLUGINS = [
    react(),
    rewriteManifestPlugin(mode),
    flattenOutput({
      removeDirs: [
        "src/pages/main",
        "src/pages/option",
        "src/pages/suspended",
        "src/pages/job",
        "src/pages/newtab",
      ],
      filePattern: ".html",
    }),
  ];

  return {
    plugins: PLUGINS,
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
          suspended: path.resolve(
            __dirname,
            "src/pages/suspended/suspended.html"
          ),
          job: path.resolve(__dirname, "src/pages/job/job.html"),
          newtab: path.resolve(__dirname, "src/pages/newtab/newtab.html"),
          content: path.resolve(__dirname, "src/content.js"),
          contentFt: path.resolve(__dirname, "src/content-ft.js"),
          "content-dyandra": path.resolve(
            __dirname,
            "src/content-dyandra.ts"
          ),
          contentOracleAcademy: path.resolve(
            __dirname,
            "src/content-oracleAcademy.ts"
          ),
          background: path.resolve(__dirname, "src/background.ts"),
          "content-moodle": path.resolve(__dirname, "src/content-moodle.ts"),
          "content-form-watcher": path.resolve(
            __dirname,
            "src/content-form-watcher.js"
          ),
          "content-undiplearn": path.resolve(
            __dirname,
            "src/content-undiplearn.ts"
          ),
          "content-absen": path.resolve(__dirname, "src/content-absen.ts"),
          "content-job": path.resolve(__dirname, "src/content-job.ts"),
        },
        output: {
          entryFileNames: "assets/[name]-[hash].js",
          chunkFileNames: "assets/[name]-[hash].js",
          assetFileNames: "assets/[name]-[hash][extname]",
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
