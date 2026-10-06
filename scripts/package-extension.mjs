#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import { spawnSync } from "node:child_process";
import { deflateRawSync } from "node:zlib";

const ROOT = process.cwd();
const DIST_DIR = path.join(ROOT, "dist");
const DEFAULT_OUT_DIR = "release";
const TARGETS = ["chrome", "firefox", "edge"];

const CRC_TABLE = new Uint32Array(256).map((_, index) => {
  let crc = index;
  for (let bit = 0; bit < 8; bit += 1) {
    crc = crc & 1 ? 0xedb88320 ^ (crc >>> 1) : crc >>> 1;
  }
  return crc >>> 0;
});

function crc32(buffer) {
  let crc = 0xffffffff;
  for (const byte of buffer) {
    crc = CRC_TABLE[(crc ^ byte) & 0xff] ^ (crc >>> 8);
  }
  return (crc ^ 0xffffffff) >>> 0;
}

function dosDateTime(date = new Date()) {
  const year = Math.max(date.getFullYear(), 1980);
  const dosTime =
    (date.getHours() << 11) | (date.getMinutes() << 5) | Math.floor(date.getSeconds() / 2);
  const dosDate = ((year - 1980) << 9) | ((date.getMonth() + 1) << 5) | date.getDate();
  return { dosTime, dosDate };
}

function writeUInt32LE(value) {
  const buffer = Buffer.allocUnsafe(4);
  buffer.writeUInt32LE(value >>> 0, 0);
  return buffer;
}

function writeUInt16LE(value) {
  const buffer = Buffer.allocUnsafe(2);
  buffer.writeUInt16LE(value & 0xffff, 0);
  return buffer;
}

function listFiles(directory, baseDirectory = directory) {
  const entries = fs.readdirSync(directory, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const fullPath = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      files.push(...listFiles(fullPath, baseDirectory));
      continue;
    }

    if (entry.isFile()) {
      files.push({
        fullPath,
        zipPath: path.relative(baseDirectory, fullPath).replaceAll(path.sep, "/"),
      });
    }
  }

  return files.sort((a, b) => a.zipPath.localeCompare(b.zipPath));
}

function createZip(sourceDirectory, outputPath) {
  const files = listFiles(sourceDirectory);
  const chunks = [];
  const centralDirectory = [];
  let offset = 0;
  const { dosTime, dosDate } = dosDateTime();

  for (const file of files) {
    const name = Buffer.from(file.zipPath, "utf8");
    const content = fs.readFileSync(file.fullPath);
    const compressed = deflateRawSync(content, { level: 9 });
    const checksum = crc32(content);

    const localHeader = Buffer.concat([
      writeUInt32LE(0x04034b50),
      writeUInt16LE(20),
      writeUInt16LE(0x0800),
      writeUInt16LE(8),
      writeUInt16LE(dosTime),
      writeUInt16LE(dosDate),
      writeUInt32LE(checksum),
      writeUInt32LE(compressed.length),
      writeUInt32LE(content.length),
      writeUInt16LE(name.length),
      writeUInt16LE(0),
      name,
    ]);

    chunks.push(localHeader, compressed);

    centralDirectory.push(
      Buffer.concat([
        writeUInt32LE(0x02014b50),
        writeUInt16LE(20),
        writeUInt16LE(20),
        writeUInt16LE(0x0800),
        writeUInt16LE(8),
        writeUInt16LE(dosTime),
        writeUInt16LE(dosDate),
        writeUInt32LE(checksum),
        writeUInt32LE(compressed.length),
        writeUInt32LE(content.length),
        writeUInt16LE(name.length),
        writeUInt16LE(0),
        writeUInt16LE(0),
        writeUInt16LE(0),
        writeUInt16LE(0),
        writeUInt32LE(0),
        writeUInt32LE(offset),
        name,
      ])
    );

    offset += localHeader.length + compressed.length;
  }

  const centralStart = offset;
  const centralBuffer = Buffer.concat(centralDirectory);
  const endOfCentralDirectory = Buffer.concat([
    writeUInt32LE(0x06054b50),
    writeUInt16LE(0),
    writeUInt16LE(0),
    writeUInt16LE(files.length),
    writeUInt16LE(files.length),
    writeUInt32LE(centralBuffer.length),
    writeUInt32LE(centralStart),
    writeUInt16LE(0),
  ]);

  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, Buffer.concat([...chunks, centralBuffer, endOfCentralDirectory]));
  return files.length;
}

function parseArgs(argv) {
  const options = {
    target: "firefox",
    build: true,
    outDir: DEFAULT_OUT_DIR,
  };

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];

    if (arg === "--") {
      continue;
    } else if (arg === "--no-build") {
      options.build = false;
    } else if (arg === "--out") {
      options.outDir = argv[++index] ?? DEFAULT_OUT_DIR;
    } else if (arg.startsWith("--out=")) {
      options.outDir = arg.slice("--out=".length);
    } else if (!arg.startsWith("--")) {
      options.target = arg;
    } else {
      throw new Error(`Unknown option "${arg}".`);
    }
  }

  if (options.target !== "all" && !TARGETS.includes(options.target)) {
    throw new Error(`Unknown target "${options.target}". Use chrome, firefox, edge, or all.`);
  }

  return options;
}

function runCommand(command, args) {
  const executable = process.platform === "win32" && command === "pnpm" ? "pnpm.cmd" : command;
  const result = spawnSync(executable, args, {
    cwd: ROOT,
    stdio: "inherit",
  });

  if (result.status !== 0) {
    throw new Error(`Command failed: ${command} ${args.join(" ")}`);
  }
}

function getPackageVersion() {
  return JSON.parse(fs.readFileSync(path.join(ROOT, "package.json"), "utf8")).version;
}

function assertBuiltDist(target) {
  const manifestPath = path.join(DIST_DIR, "manifest.json");
  if (!fs.existsSync(manifestPath)) {
    throw new Error(`Missing ${manifestPath}. Run the build before packaging ${target}.`);
  }

  const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
  return manifest.version;
}

function packageTarget(target, options) {
  if (options.build) {
    runCommand("pnpm", [`build:${target}`]);
  }

  const version = getPackageVersion();
  const manifestVersion = assertBuiltDist(target);
  if (version !== manifestVersion) {
    throw new Error(
      `Version mismatch after build: package.json=${version}, dist manifest=${manifestVersion}`
    );
  }

  const fileName = `siap-dips-${target}-v${version}.zip`;
  const outputPath = path.join(ROOT, options.outDir, fileName);
  const fileCount = createZip(DIST_DIR, outputPath);
  console.log(`Packaged ${target}: ${path.relative(ROOT, outputPath)} (${fileCount} files)`);
}

function printHelp() {
  console.log(`Usage:
  node scripts/package-extension.mjs [chrome|firefox|edge|all] [--no-build] [--out release]

Examples:
  pnpm package:firefox
  pnpm package:chrome
  pnpm package:all
  pnpm package:firefox -- --no-build`);
}

function main() {
  const argv = process.argv.slice(2);
  if (argv.includes("--help") || argv.includes("-h")) {
    printHelp();
    return;
  }

  const options = parseArgs(argv);
  const targets = options.target === "all" ? TARGETS : [options.target];

  for (const target of targets) {
    packageTarget(target, options);
  }
}

try {
  main();
} catch (error) {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
}
