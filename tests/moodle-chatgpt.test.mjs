import test from "node:test";
import assert from "node:assert/strict";

import {
  MOODLE_CHATGPT_URL_MAX_LENGTH,
  buildMoodleChatGptPrompt,
  buildMoodleChatGptSearchUrl,
  normalizeMoodlePromptText,
  shouldUseMoodleChatGptClipboardFallback,
} from "../src/lib/content_moodle/chatgpt.ts";

const payload = {
  questionLabel: "Question 1",
  questionText:
    "1 Zn + 1 Au(NO2)2 \u00a0\u2192 1 Zn(NO2)2 + 1 Au",
  options: [
    { key: "a", text: "Single replacement" },
    { key: "b", text: "Double replacement" },
    { key: "c", text: "Synthesis" },
  ],
  mode: "single",
};

test("Moodle prompt includes question and ordered choices", () => {
  const prompt = buildMoodleChatGptPrompt(payload);

  assert.match(prompt, /SOAL \(Question 1\):/);
  assert.match(prompt, /Zn \+ 1 Au/);
  assert.match(prompt, /A\. Single replacement/);
  assert.match(prompt, /C\. Synthesis/);
  assert.match(prompt, /Pilih tepat satu jawaban/);
});

test("Moodle multiple choice prompt requests all correct answers", () => {
  const prompt = buildMoodleChatGptPrompt({
    ...payload,
    mode: "multiple",
  });

  assert.match(prompt, /lebih dari satu jawaban benar/);
  assert.match(prompt, /Pilih semua jawaban yang benar/);
});

test("Moodle ChatGPT URL encodes and restores the prompt", () => {
  const prompt = "Which is correct?\nA. x < 2\nB. x >= 2";
  const parsed = new URL(buildMoodleChatGptSearchUrl(prompt));

  assert.equal(parsed.origin, "https://chatgpt.com");
  assert.equal(parsed.searchParams.get("hints"), "search");
  assert.equal(parsed.searchParams.get("q"), prompt);
});

test("Moodle long URL triggers clipboard fallback", () => {
  assert.equal(
    shouldUseMoodleChatGptClipboardFallback(
      `https://chatgpt.com/?q=${"x".repeat(MOODLE_CHATGPT_URL_MAX_LENGTH)}`
    ),
    true
  );
  assert.equal(
    shouldUseMoodleChatGptClipboardFallback("https://chatgpt.com/?q=short"),
    false
  );
});

test("Moodle prompt normalization preserves useful line breaks", () => {
  assert.equal(
    normalizeMoodlePromptText("  SELECT 1  \r\n\r\n\r\n  FROM dual  "),
    "SELECT 1\n\nFROM dual"
  );
});
