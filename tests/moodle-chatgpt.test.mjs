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
  questionText: "1 Zn + 1 Au(NO2)2 \u00a0\u2192 1 Zn(NO2)2 + 1 Au",
  fields: [
    {
      id: "q1:1_answer",
      label: "Pilihan ganda (satu jawaban)",
      kind: "choice",
      multiple: false,
      options: [
        { key: "a", text: "Single replacement" },
        { key: "b", text: "Double replacement" },
        { key: "c", text: "Synthesis" },
      ],
    },
  ],
};

test("Moodle prompt includes question and ordered choices", () => {
  const prompt = buildMoodleChatGptPrompt(payload);

  assert.match(prompt, /SOAL \(Question 1\):/);
  assert.match(prompt, /Zn \+ 1 Au/);
  assert.match(prompt, /A\. Single replacement/);
  assert.match(prompt, /C\. Synthesis/);
  assert.match(prompt, /Pilih tepat satu jawaban/);
  assert.match(prompt, /- q1:1_answer: \[huruf pilihan\]/);
});

test("Moodle multiple choice prompt requests all correct answers", () => {
  const prompt = buildMoodleChatGptPrompt({
    ...payload,
    fields: [
      {
        ...payload.fields[0],
        label: "Checkbox (boleh lebih dari satu jawaban)",
        multiple: true,
      },
    ],
  });

  assert.match(prompt, /lebih dari satu jawaban benar/);
  assert.match(prompt, /Pilih semua jawaban yang benar/);
});

test("Moodle prompt asks for text on text fields", () => {
  const prompt = buildMoodleChatGptPrompt({
    ...payload,
    fields: [
      { id: "q2:1_answer", label: "Isian 1", kind: "text" },
      {
        id: "q2:1_sub1",
        label: "Dropdown 1",
        kind: "select",
        options: [
          { key: "a", text: "HTML" },
          { key: "b", text: "CSS" },
        ],
      },
    ],
  });

  assert.match(prompt, /\[q2:1_answer\] Isian 1/);
  assert.match(prompt, /teks jawaban final/);
  assert.match(prompt, /\[q2:1_sub1\] Dropdown 1/);
  assert.match(prompt, /Pilih satu opsi untuk setiap dropdown/);
  assert.match(prompt, /- q2:1_sub1: \[huruf pilihan\]/);
  assert.match(prompt, /- q2:1_answer: \[teks jawaban\]/);
});

test("Moodle prompt still explains unfillable question types", () => {
  const prompt = buildMoodleChatGptPrompt({ ...payload, fields: [] });

  assert.match(prompt, /tidak punya kolom jawaban otomatis/);
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
