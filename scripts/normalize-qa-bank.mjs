#!/usr/bin/env node

/**
 * Normalize keys in oracleAcademyQA.ts and deduplicate.
 *
 * Usage:
 *   node scripts/normalize-qa-bank.mjs          # normalize + dedup
 *   node scripts/normalize-qa-bank.mjs --dry-run # preview only
 */

import { readFileSync, writeFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const FILE = resolve(__dirname, "../src/constants/oracleAcademyQA.ts");
const dryRun = process.argv.includes("--dry-run") || process.argv.includes("-n");

// ---------------------------------------------------------------------------
// Normalization (same as matching.ts)
// ---------------------------------------------------------------------------
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
    // Blog artifact strip must come BEFORE number prefix strip
    // so that numbers embedded in blog headers are also cleaned.
    .replace(/^\s*balasan\s+balas\s+.+?\d{1,2}\.\d{2}\s*/i, "")
    .replace(/^\s*\d+\.\s+/, "")
    .replace(/\s+/g, " ")
    .replace(/[""]/g, '"')
    .replace(/[']/g, "'")
    .trim()
    .toLowerCase();
}

// ---------------------------------------------------------------------------
// Quote helpers
// ---------------------------------------------------------------------------
function unescape(s) {
  return s.replace(/\\(['"])/g, "$1");
}

function escapeForQuote(s, quote) {
  let r = s.replace(/\\/g, "\\\\");
  r = r.replace(new RegExp(quote, "g"), "\\" + quote);
  return r;
}

// Extract quoted string content (handle escaped quotes)
// Returns { content, rest } or null
function extractQuoted(str, startIdx) {
  const s = str.slice(startIdx).trimStart();
  if (!s) return null;
  const quote = s[0];
  if (quote !== "'" && quote !== '"') return null;
  
  let content = "";
  let i = 1;
  while (i < s.length) {
    if (s[i] === "\\" && i + 1 < s.length && (s[i + 1] === "'" || s[i + 1] === '"')) {
      content += s[i + 1];
      i += 2;
    } else if (s[i] === quote) {
      return { content, rest: s.slice(i + 1) };
    } else {
      content += s[i];
      i++;
    }
  }
  return null; // unterminated quote
}

// ---------------------------------------------------------------------------
// Parse entries
// ---------------------------------------------------------------------------
// Pattern for a key line: optional indent, quoted string, colon
const KEY_LINE_RE = /^(\s*)('(?:[^'\\]|\\.)*'|"(?:[^"\\]|\\.)*")\s*:\s*/;
// Pattern for a value line: optional indent, quoted string, optional comma
const VAL_LINE_RE = /^\s*('(?:[^'\\]|\\.)*'|"(?:[^"\\]|\\.)*")\s*,?\s*$/;

// ---------------------------------------------------------------------------
// Read and process
// ---------------------------------------------------------------------------
const text = readFileSync(FILE, "utf8");
const lines = text.split("\n");

// Phase 1: identify all entries
const entries = []; // { keyLineIdx, valLineIdx, indent, rawKey, rawVal, normKey, quoteStyle }
const nonEntryLines = []; // lines not part of any entry

let inBank = false;
let pendingKey = null; // { lineIdx, indent, rawKey, quoteStyle, keyLine }

for (let i = 0; i < lines.length; i++) {
  const line = lines[i];

  // Detect bank start
  if (line.includes("export const ORACLE_QA_BANK")) {
    inBank = true;
    nonEntryLines.push({ idx: i, line });
    continue;
  }

  // Detect bank end
  if (inBank && line.trim() === "};") {
    inBank = false;
    nonEntryLines.push({ idx: i, line });
    continue;
  }

  if (!inBank) {
    nonEntryLines.push({ idx: i, line });
    continue;
  }

  // Inside the bank
  const trimmed = line.trim();
  
  // Skip blank lines and comments inside the bank
  if (!trimmed || trimmed.startsWith("//")) {
    nonEntryLines.push({ idx: i, line });
    continue;
  }

  // Check if this is a key line (starts with quote)
  const keyMatch = trimmed.match(/^('(?:[^'\\]|\\.)*'|"(?:[^"\\]|\\.)*")\s*:\s*/);
  
  if (keyMatch) {
    // If there was a pending key from before (shouldn't happen in well-formed data, but handle it)
    if (pendingKey) {
      // Treat the previous key as having its value on this line... actually no.
      // This means a key without a value was followed by another key. Skip previous.
      console.warn(`  WARN: orphan key at line ${pendingKey.lineIdx}: "${pendingKey.rawKey.substring(0, 60)}..."`);
      nonEntryLines.push({ idx: pendingKey.lineIdx, line: pendingKey.keyLine });
    }

    // Extract the full key string and what comes after the colon
    const rawKey = keyMatch[1].slice(1, -1);
    const quoteStyle = keyMatch[1][0];
    const afterColon = trimmed.slice(keyMatch[0].length).trim();

    if (afterColon) {
      // Value is on the same line (e.g. 'key': 'value',)
      const valMatch = afterColon.match(/^('(?:[^'\\]|\\.)*'|"(?:[^"\\]|\\.)*")\s*,?\s*$/);
      if (valMatch) {
        const rawVal = valMatch[1].slice(1, -1);
        entries.push({
          keyLineIdx: i,
          valLineIdx: i,
          indent: line.match(/^\s*/)[0],
          rawKey,
          rawVal,
          normKey: normalizeText(rawKey),
          quoteStyle,
        });
      } else {
        // After colon but not a simple value — treat as part of key?
        // Actually this shouldn't happen in our data
        console.warn(`  WARN: unparseable value on same line at ${i + 1}: "${afterColon.substring(0, 60)}..."`);
        nonEntryLines.push({ idx: i, line });
      }
    } else {
      // Value is on the next line
      pendingKey = {
        lineIdx: i,
        indent: line.match(/^\s*/)[0],
        rawKey,
        quoteStyle,
        keyLine: line,
      };
    }
  } else if (pendingKey) {
    // This might be a value line for the pending key
    // Check if it starts with a quoted string (value)
    const valLine = trimmed;
    const valMatch = valLine.match(/^('(?:[^'\\]|\\.)*'|"(?:[^"\\]|\\.)*")\s*,?\s*$/);
    
    if (valMatch) {
      const rawVal = valMatch[1].slice(1, -1);
      entries.push({
        keyLineIdx: pendingKey.lineIdx,
        valLineIdx: i,
        indent: pendingKey.indent,
        rawKey: pendingKey.rawKey,
        rawVal,
        normKey: normalizeText(pendingKey.rawKey),
        quoteStyle: pendingKey.quoteStyle,
      });
      pendingKey = null;
    } else if (valLine.startsWith("//") || !valLine) {
      // Comment or blank line — skip, keep pending
      nonEntryLines.push({ idx: i, line });
    } else {
      // Not a value line — orphan key
      console.warn(`  WARN: orphan key at line ${pendingKey.lineIdx}: "${pendingKey.rawKey.substring(0, 60)}..."`);
      nonEntryLines.push({ idx: pendingKey.lineIdx, line: pendingKey.keyLine });
      nonEntryLines.push({ idx: i, line });
      pendingKey = null;
    }
  } else {
    // Line inside bank that's not a key, not a value, not blank, not a comment
    // This shouldn't happen normally
    nonEntryLines.push({ idx: i, line });
  }
}

// Handle last pending key
if (pendingKey) {
  console.warn(`  WARN: orphan key at EOF line ${pendingKey.lineIdx}: "${pendingKey.rawKey.substring(0, 60)}..."`);
  nonEntryLines.push({ idx: pendingKey.lineIdx, line: pendingKey.keyLine });
}

console.log(`\nParsed ${entries.length} entries, ${nonEntryLines.length} non-entry lines`);

// ---------------------------------------------------------------------------
// Value normalization for conflict detection
// ---------------------------------------------------------------------------
// Normalizes answer values for comparison:
// 1. Unescape quotes
// 2. Split by `|` (multi-answer delimiter)
// 3. Trim and normalize whitespace in each part
// 4. Sort parts (order doesn't matter for multi-answer questions)
// 5. Rejoin with `|`
function normalizeValue(val) {
  const parts = val
    .split("|")
    .map((p) => 
      p
        .trim()
        .replace(/\s+/g, " ")
        // Normalize quotes to ASCII
        .replace(/[\u2018\u2019]/g, "'")
        .replace(/[\u201C\u201D]/g, '"')
        // Strip escape backslashes before quotes for comparison
        .replace(/\\(['"])/g, "$1")
    )
    .sort();
  return parts.join("|");
}

// Phase 2: detect duplicates & conflicts
const normMap = new Map(); // normKey → { entries, valueSet }
const conflictKeys = new Set();

for (const e of entries) {
  if (!e.normKey) {
    console.warn(`  WARN: empty normalized key at line ${e.keyLineIdx + 1}`);
    continue;
  }
  if (!normMap.has(e.normKey)) {
    normMap.set(e.normKey, { entries: [], valueSet: new Set() });
  }
  const group = normMap.get(e.normKey);
  group.entries.push(e);
  // Use normalized value for comparison
  group.valueSet.add(normalizeValue(e.rawVal));
  if (group.valueSet.size > 1) {
    conflictKeys.add(e.normKey);
  }
}

const safeDups = [];
const conflicts = [];

for (const [normKey, group] of normMap) {
  if (group.entries.length > 1) {
    if (group.valueSet.size === 1) {
      safeDups.push({ normKey, count: group.entries.length, entries: group.entries });
    } else {
      conflicts.push({ normKey, entries: group.entries, values: [...group.valueSet] });
    }
  }
}

// Report
if (safeDups.length > 0) {
  console.log(`\n=== SAFE DUPLICATES (${safeDups.length} groups, ${safeDups.reduce((s, d) => s + d.count - 1, 0)} removable) ===`);
  for (const d of safeDups) {
    const keys = d.entries.map((e) => `L${e.keyLineIdx + 1}: "${e.rawKey.substring(0, 80)}..."`).join("\n      ");
    console.log(`  [${d.count}x] "${d.normKey.substring(0, 100)}..."\n      ${keys}`);
  }
}

if (conflicts.length > 0) {
  console.log(`\n=== CONFLICTS (${conflicts.length} groups) ===`);
  for (const c of conflicts) {
    console.log(`  DIFFERENT VALUES: "${c.normKey.substring(0, 100)}..."`);
    for (const e of c.entries) {
      console.log(`    L${e.keyLineIdx + 1}: KEY="${e.rawKey.substring(0, 80)}..."  VAL="${e.rawVal}"`);
    }
  }
}

// Phase 3: decide which entries to keep/remove
const removeLineIdxs = new Set();

for (const d of safeDups) {
  // Keep the entry with the shortest/most cleaned rawKey (prefer no prefix)
  // Sort by rawKey length (ascending — shorter is cleaner)
  const sorted = [...d.entries].sort((a, b) => a.rawKey.length - b.rawKey.length);
  const keep = sorted[0];
  for (const e of sorted) {
    if (e !== keep) {
      removeLineIdxs.add(e.keyLineIdx);
      removeLineIdxs.add(e.valLineIdx);
    }
  }
}

// Phase 4: rebuild file
if (!dryRun) {
  const newLines = [];
  // Track which normKeys have been written (to skip duplicates)
  const writtenNormKeys = new Set();

  // Build a set of normKeys that are in conflict (same key, different value)
  const conflictNormKeys = new Set(conflicts.map((c) => c.normKey));

  let i = 0;
  while (i < lines.length) {
    if (removeLineIdxs.has(i)) {
      i++;
      continue;
    }

    // Check if this line is the key line of an entry we need to normalize
    const entryIdx = entries.findIndex((e) => e.keyLineIdx === i);
    if (entryIdx !== -1) {
      const e = entries[entryIdx];
      const normKey = normalizeText(e.rawKey);

      // Only skip duplicates for SAFE entries, not conflicts
      if (!conflictNormKeys.has(normKey) && writtenNormKeys.has(normKey)) {
        i++;
        continue;
      }
      writtenNormKeys.add(normKey);

      // Write the key line with normalized key
      const escapedKey = escapeForQuote(normKey, e.quoteStyle);
      const escapedVal = escapeForQuote(e.rawVal, e.quoteStyle);

      if (e.keyLineIdx === e.valLineIdx) {
        // Single line: write key: value
        newLines.push(`\t${e.quoteStyle}${escapedKey}${e.quoteStyle}: ${e.quoteStyle}${escapedVal}${e.quoteStyle},`);
        i++;
      } else {
        // Multi-line: write key on one line, value on next line
        newLines.push(`\t${e.quoteStyle}${escapedKey}${e.quoteStyle}:`);
        newLines.push(`\t\t${e.quoteStyle}${escapedVal}${e.quoteStyle},`);
        i++;
        // Skip the original value line
        if (i < lines.length && entries.findIndex((ee) => ee.valLineIdx === i) === entryIdx) {
          i++;
        }
      }
    } else if (entries.findIndex((e) => e.valLineIdx === i && e.keyLineIdx !== i) !== -1) {
      // This is a value-only line for a multi-line entry
      const entryForVal = entries.find((e) => e.valLineIdx === i && e.keyLineIdx !== i);
      if (entryForVal && (removeLineIdxs.has(entryForVal.keyLineIdx))) {
        i++;
        continue;
      }
      // Already handled when key was processed — skip
      i++;
      continue;
    } else {
      // Non-entry line — keep as-is
      newLines.push(lines[i]);
      i++;
    }
  }

  writeFileSync(FILE, newLines.join("\n"), "utf8");
  console.log(`\n✓ Wrote ${newLines.length} lines to ${FILE}`);
  const removed = removeLineIdxs.size;
  const totalBefore = entries.length;
  const totalAfter = writtenNormKeys.size;
  console.log(`  Removed ${removed} duplicate lines`);
  console.log(`  Entries: ${totalBefore} → ${totalAfter}`);
} else {
  console.log(`\nDRY RUN (no changes written)`);
  const removable = safeDups.reduce((s, d) => s + d.entries.length - 1, 0);
  console.log(`  Would remove ${removeLineIdxs.size} lines (${removable} duplicate entries)`);
  const totalAfter = entries.length - safeDups.reduce((s, d) => s + d.entries.length - 1, 0);
  console.log(`  Entries: ${entries.length} → ${totalAfter}`);
  if (conflicts.length > 0) {
    console.log(`  ⚠ ${conflicts.length} conflict(s) need manual review (see above)`);
  }
}
