const fs = require("fs");
const content = fs.readFileSync("src/constants/oracleAcademyQA.ts", "utf8");
const lines = content.split(/\r?\n/);
let insideBank = false;
const keyCounts = new Map();
const keysInOrder = [];
for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  if (line.includes("export const ORACLE_QA_BANK")) {
    insideBank = true;
    continue;
  }
  if (insideBank && line.trim() === "};") {
    insideBank = false;
    continue;
  }
  if (insideBank) {
    // Improved regex to handle keys spanning multiple lines or with different quoting/spacing
    const match = line.match(/^\s*"(.*)"\s*:/) || 
                  line.match(/^\s*'(.*)'\s*:/) || 
                  line.match(/^\s*`((?:.|\n)*?)`\s*:/);
    if (match) {
      const key = match[1].trim(); // trim to avoid minor variations
      const lineNumber = i + 1;
      keysInOrder.push({ key, lineNumber });
      if (!keyCounts.has(key)) {
        keyCounts.set(key, []);
      }
      keyCounts.get(key).push(lineNumber);
    }
  }
}
const duplicates = [];
for (const [key, lineNumbers] of keyCounts.entries()) {
  if (lineNumbers.length > 1) {
    duplicates.push({ key, lineNumbers });
  }
}
if (duplicates.length === 0) {
  console.log("No duplicates found.");
} else {
  console.log(`Found ${duplicates.length} duplicate keys.\n`);
  duplicates.sort((a, b) => a.lineNumbers[0] - b.lineNumbers[0]);
  duplicates.forEach((d) => {
    console.log(`Key: "${d.key}"`);
    console.log(`First Line: ${d.lineNumbers[0]}`);
    console.log(`Repeat Lines: ${d.lineNumbers.slice(1).join(", ")}`);
    console.log("");
  });
  const repeatIndices = [];
  const seenFirst = new Set();
  for (let i = 0; i < keysInOrder.length; i++) {
    const { key } = keysInOrder[i];
    if (keyCounts.get(key).length > 1) {
        if (seenFirst.has(key)) {
            repeatIndices.push(i);
        } else {
            seenFirst.add(key);
        }
    }
  }
  let isContiguous = true;
  for (let i = 1; i < repeatIndices.length; i++) {
    if (repeatIndices[i] !== repeatIndices[i-1] + 1) {
      isContiguous = false;
      break;
    }
  }
  const isTail = isContiguous && repeatIndices.length > 0 && repeatIndices[repeatIndices.length - 1] === keysInOrder.length - 1;
  if (isTail) {
    console.log("The duplicates are one contiguous tail block.");
  } else if (isContiguous && repeatIndices.length > 0) {
    console.log("The duplicates are one contiguous block (but not at the absolute tail).");
  } else {
    console.log("The duplicates are multiple separate clusters.");
  }
}
