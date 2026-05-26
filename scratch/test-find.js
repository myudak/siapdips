import { ORACLE_QA_BANK } from "../src/constants/oracleAcademyQA.ts";

function normalizeText(txt) {
  if (!txt) return "";

  return txt
    // Convert non-breaking spaces to normal spaces
    .replace(/\u00A0/g, " ")
    // Normalize dashes/quotes to ASCII
    .replace(/[\u2013\u2014]/g, "-")
    .replace(/[\u2018\u2019]/g, "'")
    .replace(/[\u201C\u201D]/g, '"')
    // Strip common instruction suffixes to make matching incredibly resilient
    .replace(/\s*\(\s*choose\s+\w+\s*answers?\.?\s*\)/gi, "")
    .replace(/\s*\(\s*select\s+\w+\s*answers?\.?\s*\)/gi, "")
    .replace(/\s*\(\s*choose\s+\w+\.?\s*\)/gi, "")
    .replace(/\s*\(\s*select\s+\w+\.?\s*\)/gi, "")
    .replace(/\s*\(\s*choose\s+all\s+correct\s+answers?\.?\s*\)/gi, "")
    .replace(/\s*mark\s+for\s+review/gi, "")
    // Collapse multiple whitespace into a single space
    .replace(/\s+/g, " ")
    // Normalize curly quotes to straight quotes
    .replace(/[""]/g, '"')
    .replace(/[']/g, "'")
    .trim()
    .toLowerCase();
}

function findAnswerForQuestion(questionRaw) {
  const questionNorm = normalizeText(questionRaw);
  if (!questionNorm) return null;

  const entries = Object.entries(ORACLE_QA_BANK)
    .map(([key, val]) => ({
      keyNorm: normalizeText(key),
      val,
      keyRaw: key
    }));

  // 1) Exact match on normalized key
  for (const { keyNorm, val } of entries) {
    if (keyNorm === questionNorm) return { val, type: "exact" };
  }

  // 2) Question contains key
  const containsMatches = entries
    .filter(({ keyNorm }) => keyNorm && questionNorm.includes(keyNorm))
    .sort((a, b) => b.keyNorm.length - a.keyNorm.length);
  if (containsMatches.length) return { val: containsMatches[0].val, type: "contains" };

  // 3) Key contains question
  for (const { keyNorm, val } of entries) {
    if (keyNorm.includes(questionNorm)) return { val, type: "key-contains" };
  }

  // 4) Fallback: match on leading part of the question
  const leadingQuestion = questionNorm.slice(0, 160);
  for (const { keyNorm, val } of entries) {
    const leadingKey = keyNorm.slice(0, 160);
    if (
      leadingQuestion.startsWith(leadingKey) ||
      leadingKey.startsWith(leadingQuestion)
    ) {
      return { val, type: "leading" };
    }
  }

  return null;
}

// Test cases
const questionsToTest = [
  "Which three statements concerning explicit data type conversions are true? (Choose three.)",
  "Which three statements concerning explicit data type conversions are true? (Choose three)",
  "Which three statements concerning explicit data type conversions are true?",
  "Which three statements concerning explicit data type conversions are true? (select three)",
  "Which three statements concerning explicit data type conversions are true? (Choose three.) Mark for review"
];

for (const q of questionsToTest) {
  const res = findAnswerForQuestion(q);
  console.log(`Q: "${q}"`);
  console.log(`Normalized: "${normalizeText(q)}"`);
  if (res) {
    console.log(`MATCHED (${res.type}): "${res.val}"`);
  } else {
    console.log(`NOT MATCHED`);
  }
  console.log("-------------------");
}
