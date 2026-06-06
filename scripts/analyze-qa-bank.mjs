#!/usr/bin/env node

/**
 * Analyze oracleAcademyQA.ts for:
 * 1. Distinct normalized keys grouped by answer (detect duplicates & conflicts)
 * 2. Blog/forum comment artifacts in keys
 * 3. Section prefixes (S4, S6 Q1, etc.)
 * 4. Number prefixes (8., 10., etc.)
 * 5. Entries where key contains answer-option text
 *
 * Usage: node scripts/analyze-qa-bank.mjs
 */

import { readFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

// Inline normalizeText to avoid TS import issues
function normalizeText(txt) {
  if (!txt) return "";
  return txt
    .replace(/\u00A0/g, " ")
    .replace(/[\u2013\u2014]/g, "-")
    .replace(/[\u2018\u2019]/g, "'")
    .replace(/[\u201C\u201D]/g, '"')
    .replace(/\s*\(\s*choose\s+\w+\s*answers?\.?\s*\)/gi, "")
    .replace(/\s*\(\s*select\s+\w+\s*answers?\.?\s*\)/gi, "")
    .replace(/\s*\(\s*choose\s+\w+\.?\s*\)/gi, "")
    .replace(/\s*\(\s*select\s+\w+\.?\s*\)/gi, "")
    .replace(/\s*\(\s*choose\s+all\s+correct\s+answers?\.?\s*\)/gi, "")
    .replace(/\s*\(\s*select\s+all\s+correct\s+answers?\.?\s*\)/gi, "")
    .replace(/\s*\(\s*true\s+or\s+false\?\)\s*/gi, "")
    .replace(/\s*true\s+or\s+false\?\s*/gi, "")
    .replace(/\s*mark\s+for\s+review/gi, "")
    .replace(/^\s*s\d+[a-z]?\s*(?:q\d+\s*)?/i, "")
    .replace(/^\s*\d+\.\s+/, "")
    .replace(/^\s*balasan\s+balas\s+.+?\d{1,2}\.\d{2}\s*/i, "")
    .replace(/\s+/g, " ")
    .replace(/[""]/g, '"')
    .replace(/[']/g, "'")
    .trim()
    .toLowerCase();
}

const __dirname = dirname(fileURLToPath(import.meta.url));
const filePath = resolve(__dirname, "../src/constants/oracleAcademyQA.ts");
const raw = readFileSync(filePath, "utf8");

// Extract key-value pairs using regex
// Each line looks like:
//   'key text': 'value text',
// or multi-line blocks
const entries = [];

// Match: optional whitespace, quoted key (single or double quotes), colon, optional whitespace, quoted value, comma
const keyValueRegex = /^\s*('(?:[^'\\]|\\.)*'|"(?:[^"\\]|\\.)*")\s*:\s*('(?:[^'\\]|\\.)*'|"(?:[^"\\]|\\.)*")\s*,?\s*$/gm;

let match;
while ((match = keyValueRegex.exec(raw)) !== null) {
  const rawKey = match[1].slice(1, -1);  // Remove surrounding quotes
  const rawValue = match[2].slice(1, -1); // Remove surrounding quotes
  const lineNum = raw.substring(0, match.index).split("\n").length;
  
  entries.push({
    rawKey,
    rawValue,
    normKey: normalizeText(rawKey),
    lineNum,
  });
}

// Check for blog artifacts
console.log("=== BLOG/FORUM ARTIFACTS ===");
let blogCount = 0;
for (const e of entries) {
  if (/balasan\s+balas/i.test(e.rawKey) || /^null,\s*null,\s*\{\}\);/i.test(e.rawKey)) {
    blogCount++;
    console.log(`\n[Line ${e.lineNum}] RAW KEY:`);
    console.log(`  "${e.rawKey.substring(0, 200)}..."`);
    console.log(`  VALUE: "${e.rawValue}"`);
    console.log(`  NORM:  "${e.normKey.substring(0, 150)}..."`);
    if (e.normKey && e.normKey !== normalizeText(e.rawKey)) {
      // Check if normalized form reveals a clean question
      console.log(`  CLEAN: YES (normalizable)`);
    } else {
      console.log(`  CLEAN: ? (check manually)`);
    }
  }
}
console.log(`\nTotal blog artifacts: ${blogCount}`);

// Check for section prefixes
console.log("\n\n=== SECTION PREFIXES (S4, S6 Q1, etc.) ===");
let sectionCount = 0;
for (const e of entries) {
  const rawFirst = e.rawKey.replace(/\s*\(.*\)\s*$/, "").trim();
  if (/^S\d+[A-Z]?\s/i.test(rawFirst)) {
    sectionCount++;
  }
}
console.log(`Total entries with section prefixes: ${sectionCount}`);

// Check for number prefixes
console.log("\n\n=== NUMBER PREFIXES (8., 10., etc.) ===");
let numberPrefixCount = 0;
for (const e of entries) {
  if (/^\d+\.\s/.test(e.rawKey)) {
    numberPrefixCount++;
  }
}
console.log(`Total entries with number prefixes: ${numberPrefixCount}`);

// Group by normalized key to find duplicates and conflicts
console.log("\n\n=== DUPLICATES & CONFLICTS (by normalized key) ===");
const groups = new Map();
for (const e of entries) {
  const key = e.normKey;
  if (!key) continue;
  if (!groups.has(key)) groups.set(key, []);
  groups.get(key).push(e);
}

let dupCount = 0;
let conflictCount = 0;
for (const [normKey, group] of groups) {
  if (group.length > 1) {
    // Check if all values are the same
    const values = [...new Set(group.map((e) => e.rawValue.trim()))];
    if (values.length === 1) {
      // Safe duplicate - same normalized key, same answer
      dupCount++;
    } else {
      // Conflict - same normalized key, different answers
      conflictCount++;
      console.log(`\nCONFLICT (${values.length} different answers): "${normKey.substring(0, 120)}..."`);
      for (const e of group) {
        console.log(`  Line ${e.lineNum}: RAW="${e.rawKey.substring(0, 100)}..." → VALUE="${e.rawValue}"`);
      }
    }
  }
}
console.log(`\nSafe duplicates (same answer): ${dupCount}`);
console.log(`Conflicts (different answers): ${conflictCount}`);

// Summary
console.log("\n\n=== SUMMARY ===");
console.log(`Total entries: ${entries.length}`);
console.log(`Blog artifacts: ${blogCount}`);
console.log(`Section prefixes: ${sectionCount}`);
console.log(`Number prefixes: ${numberPrefixCount}`);
console.log(`Safe duplicates (same norm key + same value): ${dupCount}`);
console.log(`Conflicts (same norm key + DIFFERENT value): ${conflictCount}`);
console.log(`Estimated entries after dedup: ${entries.length - dupCount}`);
