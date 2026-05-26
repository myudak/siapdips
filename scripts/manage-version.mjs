#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import process from "node:process";

const ROOT = process.cwd();
const JSON_FILES = [
  "package.json",
  "src/manifest-chrome.json",
  "src/manifest-firefox.json",
  "src/manifest-edge.json",
];
const OPTIONAL_JSON_FILES = ["package-lock.json"];
const STORAGE_CONSTANTS_FILE = "src/constants/storage.ts";
const VERSION_RE = /^\d+\.\d+\.\d+(?:\.\d+)?$/;

function readJson(relativePath) {
  const filePath = path.join(ROOT, relativePath);
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function writeJson(relativePath, value) {
  const filePath = path.join(ROOT, relativePath);
  fs.writeFileSync(filePath, `${JSON.stringify(value, null, 2)}\n`, "utf8");
}

function fileExists(relativePath) {
  return fs.existsSync(path.join(ROOT, relativePath));
}

function getTrackedFiles() {
  return [
    ...JSON_FILES,
    ...OPTIONAL_JSON_FILES.filter((relativePath) => fileExists(relativePath)),
  ];
}

function formatReleaseDate(date = new Date()) {
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: "Asia/Jakarta",
  }).format(date);
}

function readStorageConstants() {
  const source = fs.readFileSync(path.join(ROOT, STORAGE_CONSTANTS_FILE), "utf8");
  const version = source.match(/export const VERSION = "([^"]+)";/)?.[1];
  const lastUpdate = source.match(/export const LAST_UPDATE = "([^"]+)";/)?.[1];
  return { version, lastUpdate };
}

function getVersions() {
  const versions = getTrackedFiles().map((relativePath) => {
    const json = readJson(relativePath);
    const version =
      relativePath === "package-lock.json"
        ? json.version ?? json.packages?.[""]?.version
        : json.version;

    return { file: relativePath, version };
  });

  const storageConstants = readStorageConstants();
  versions.push({
    file: STORAGE_CONSTANTS_FILE,
    version: storageConstants.version,
  });

  return versions;
}

function assertValidVersion(version) {
  if (!VERSION_RE.test(version)) {
    throw new Error(
      `Invalid version "${version}". Use numeric manifest-safe versions like 1.4.970.`
    );
  }
}

function bumpVersion(version, bumpType) {
  assertValidVersion(version);

  const parts = version.split(".").map((part) => Number(part));
  const [major, minor, patch, build] = parts;

  if (bumpType === "major") return `${major + 1}.0.0`;
  if (bumpType === "minor") return `${major}.${minor + 1}.0`;
  if (bumpType === "patch") return `${major}.${minor}.${patch + 1}`;
  if (bumpType === "build") {
    return `${major}.${minor}.${patch}.${Number.isFinite(build) ? build + 1 : 1}`;
  }

  throw new Error(`Unknown bump type "${bumpType}". Use major, minor, patch, or build.`);
}

function setFileVersion(relativePath, version) {
  const json = readJson(relativePath);
  json.version = version;

  if (relativePath === "package-lock.json" && json.packages?.[""]) {
    json.packages[""].version = version;
  }

  writeJson(relativePath, json);
}

function setStorageConstantsVersion(version, lastUpdate = formatReleaseDate()) {
  const filePath = path.join(ROOT, STORAGE_CONSTANTS_FILE);
  let source = fs.readFileSync(filePath, "utf8");

  source = source.replace(
    /export const VERSION = "([^"]+)";/,
    `export const VERSION = "${version}";`
  );
  source = source.replace(
    /export const LAST_UPDATE = "([^"]+)";/,
    `export const LAST_UPDATE = "${lastUpdate}";`
  );

  fs.writeFileSync(filePath, source, "utf8");
}

function setAllVersions(version) {
  assertValidVersion(version);
  for (const relativePath of getTrackedFiles()) {
    setFileVersion(relativePath, version);
  }
  setStorageConstantsVersion(version);
}

function printStatus() {
  const versions = getVersions();
  const expected = versions.find((item) => item.file === "package.json")?.version;
  const width = Math.max(...versions.map((item) => item.file.length));

  for (const { file, version } of versions) {
    const marker = version === expected ? "ok " : "bad";
    console.log(`${marker} ${file.padEnd(width)} ${version ?? "(missing)"}`);
  }

  const uniqueVersions = new Set(versions.map((item) => item.version));
  if (uniqueVersions.size === 1) {
    console.log(`\nVersion is synced: ${expected}`);
    console.log(`Last update: ${readStorageConstants().lastUpdate ?? "(missing)"}`);
    return true;
  }

  console.log("\nVersion mismatch found.");
  return false;
}

function printHelp() {
  console.log(`Usage:
  node scripts/manage-version.mjs status
  node scripts/manage-version.mjs check
  node scripts/manage-version.mjs sync [version]
  node scripts/manage-version.mjs set <version>
  node scripts/manage-version.mjs bump <major|minor|patch|build>
  node scripts/manage-version.mjs major|minor|patch|build

Examples:
  pnpm version:status
  pnpm version:patch
  pnpm version:set 1.4.970`);
}

function main() {
  const [command = "status", maybeValue] = process.argv.slice(2);
  const packageVersion = readJson("package.json").version;

  if (command === "help" || command === "--help" || command === "-h") {
    printHelp();
    return;
  }

  if (command === "status") {
    process.exitCode = printStatus() ? 0 : 1;
    return;
  }

  if (command === "check") {
    process.exitCode = printStatus() ? 0 : 1;
    return;
  }

  if (command === "sync") {
    const version = maybeValue ?? packageVersion;
    setAllVersions(version);
    console.log(`Synced package and manifests to ${version}`);
    return;
  }

  if (command === "set") {
    if (!maybeValue) throw new Error("Missing version for set command.");
    setAllVersions(maybeValue);
    console.log(`Set package and manifests to ${maybeValue}`);
    return;
  }

  if (command === "bump") {
    if (!maybeValue) throw new Error("Missing bump type.");
    const nextVersion = bumpVersion(packageVersion, maybeValue);
    setAllVersions(nextVersion);
    console.log(`Bumped ${packageVersion} -> ${nextVersion}`);
    return;
  }

  if (["major", "minor", "patch", "build"].includes(command)) {
    const nextVersion = bumpVersion(packageVersion, command);
    setAllVersions(nextVersion);
    console.log(`Bumped ${packageVersion} -> ${nextVersion}`);
    return;
  }

  throw new Error(`Unknown command "${command}". Run with --help for usage.`);
}

try {
  main();
} catch (error) {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
}
