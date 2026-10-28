// Pure helpers for Moodle AI answers. No DOM and no chrome APIs live here so the
// logic stays unit-testable; the DOM side is in ./question.ts.

import type { MoodleAnswerField, MoodleQuestionPayload } from "./question";

export interface MoodleAnswerEntry {
  field: string;
  value: string;
}

export interface MoodleAnswerResult {
  answers: MoodleAnswerEntry[];
  confidence?: number;
  reasoning_brief?: string;
  /** Set when the provider answered with the legacy single-letter format. */
  legacyAnswerLetter?: string;
  /** Answer for question types that cannot be filled in automatically. */
  freeText?: string;
}

export interface ResolvedMoodleAnswer {
  fieldId: string;
  field: MoodleAnswerField;
  /** Index into field.options, for choice/select fields. */
  optionIndex?: number;
  /** Raw answer text, for text fields. */
  text?: string;
  /** Human readable rendering of the value that was picked. */
  display: string;
}

const MULTIPLE_VALUE_SEPARATOR = /\s*(?:,|;|\bdan\b|\bdengan\b|\n)\s*/i;

export function normalizeAnswerText(value: string): string {
  return value.replace(/\s+/g, " ").trim();
}

function compareKey(value: string): string {
  return normalizeAnswerText(value).toLowerCase();
}

export function splitAnswerValues(value: string): string[] {
  return value
    .split(MULTIPLE_VALUE_SEPARATOR)
    .map((part) => part.trim())
    .filter(Boolean);
}

const FALLBACK_OPTION_LABEL = /^item \d+$/;

/**
 * Options the AI cannot tell apart are a coin flip: image drag items that all
 * read "Part of river", or labels that fell back to "Item 1". Such a field is
 * left to the user instead of being filled with a guess.
 */
export function hasDistinguishableOptions(
  options: Array<{ key: string; text: string }> | undefined
): boolean {
  if (!options || options.length < 2) return true;

  const labels = new Set(
    options
      .map((option) => compareKey(option.text))
      .filter((label) => label && !FALLBACK_OPTION_LABEL.test(label))
  );

  return labels.size > 1;
}

function resolveChoiceOption(
  field: MoodleAnswerField,
  value: string
): number | undefined {
  const options = field.options ?? [];
  if (options.length === 0) return undefined;

  const wanted = compareKey(value).replace(/^([a-z])[.)]\s*/, "$1");
  if (!wanted) return undefined;

  const byKey = options.findIndex((option) => compareKey(option.key) === wanted);
  if (byKey !== -1) return byKey;

  const byText = options.findIndex((option) => compareKey(option.text) === wanted);
  if (byText !== -1) return byText;

  // Longest-first so "Jakarta" does not win over "Jakarta Pusat".
  const candidates = options
    .map((option, index) => ({ index, text: compareKey(option.text) }))
    .filter(({ text }) => text.length > 3)
    .sort((a, b) => b.text.length - a.text.length);

  for (const candidate of candidates) {
    if (wanted.includes(candidate.text) || candidate.text.includes(wanted)) {
      return candidate.index;
    }
  }

  return undefined;
}

function resolveChoiceField(
  field: MoodleAnswerField,
  value: string
): ResolvedMoodleAnswer[] {
  const rawValues = field.multiple ? splitAnswerValues(value) : [value];
  const resolved: ResolvedMoodleAnswer[] = [];

  for (const rawValue of rawValues) {
    const optionIndex = resolveChoiceOption(field, rawValue);
    if (optionIndex === undefined) {
      console.warn(
        "AI answer does not match any option for field:",
        field.id,
        rawValue
      );
      continue;
    }

    const option = field.options?.[optionIndex];
    resolved.push({
      fieldId: field.id,
      field,
      optionIndex,
      display: option ? `${option.key.toUpperCase()}. ${option.text}` : rawValue,
    });
  }

  return resolved;
}

/**
 * Maps the AI answer entries onto the fields actually rendered on the page.
 * Entries pointing at unknown fields or un-matchable options are dropped.
 */
export function resolveMoodleAnswers(
  result: MoodleAnswerResult | null,
  question: MoodleQuestionPayload
): ResolvedMoodleAnswer[] {
  if (!result) return [];

  const resolved: ResolvedMoodleAnswer[] = [];

  for (const entry of result.answers) {
    const field = question.fields.find(
      (candidate) => candidate.id === entry.field
    );
    if (!field) {
      console.warn("AI answered an unknown Moodle field:", entry.field);
      continue;
    }

    if (field.kind === "text") {
      const text = normalizeAnswerText(entry.value);
      if (!text) continue;
      resolved.push({ fieldId: field.id, field, text, display: text });
      continue;
    }

    resolved.push(...resolveChoiceField(field, entry.value));
  }

  return resolved;
}

function toAnswerEntries(value: unknown): MoodleAnswerEntry[] {
  if (Array.isArray(value)) {
    const entries: MoodleAnswerEntry[] = [];

    for (const item of value) {
      if (typeof item === "string") {
        const separator = item.indexOf("=");
        if (separator <= 0) {
          // Providers sometimes drop the field id and answer with the bare
          // value; keep it so a single-field question can still be answered.
          const bare = item.trim();
          if (bare) entries.push({ field: "", value: bare });
          continue;
        }
        const field = item.slice(0, separator).trim();
        const answer = item.slice(separator + 1).trim();
        if (field && answer) entries.push({ field, value: answer });
        continue;
      }

      if (item && typeof item === "object") {
        const candidate = item as { field?: unknown; value?: unknown };
        if (
          typeof candidate.field === "string" &&
          typeof candidate.value === "string"
        ) {
          entries.push({
            field: candidate.field.trim(),
            value: candidate.value.trim(),
          });
        }
      }
    }

    // A missing field id is allowed: bindAnswerEntriesToFields repairs it.
    return entries.filter((entry) => entry.value);
  }

  if (value && typeof value === "object") {
    return Object.entries(value as Record<string, unknown>)
      .filter(([, answer]) => typeof answer === "string")
      .map(([field, answer]) => ({
        field: field.trim(),
        value: (answer as string).trim(),
      }))
      .filter((entry) => entry.field && entry.value);
  }

  return [];
}

/**
 * Accepts the tool-call arguments object (or a JSON body) in every shape the
 * providers may return: `answers` as string/object array or as a map, plus the
 * legacy single-choice `answer_letter`/`answer_text` pair.
 */
export function parseMoodleAnswerPayload(
  value: unknown
): MoodleAnswerResult | null {
  if (!value || typeof value !== "object") return null;

  const candidate = value as {
    answers?: unknown;
    answer_letter?: unknown;
    answer_text?: unknown;
    confidence?: unknown;
    reasoning_brief?: unknown;
  };

  const answers = toAnswerEntries(candidate.answers);
  const answerText =
    typeof candidate.answer_text === "string" ? candidate.answer_text.trim() : "";

  if (answers.length > 0) {
    return {
      answers,
      freeText: answerText || undefined,
      confidence:
        typeof candidate.confidence === "number"
          ? candidate.confidence
          : undefined,
      reasoning_brief:
        typeof candidate.reasoning_brief === "string"
          ? candidate.reasoning_brief
          : undefined,
    };
  }

  // Question types with nothing to fill in (essay, image drag) answer with
  // free text only.
  if (!candidate.answer_letter && answerText) {
    return {
      answers: [],
      freeText: answerText,
      confidence:
        typeof candidate.confidence === "number"
          ? candidate.confidence
          : undefined,
      reasoning_brief:
        typeof candidate.reasoning_brief === "string"
          ? candidate.reasoning_brief
          : undefined,
    };
  }

  if (typeof candidate.answer_letter !== "string") return null;

  const letter = candidate.answer_letter.trim().toLowerCase();
  if (!letter) return null;

  return {
    answers: [{ field: "", value: answerText || letter }],
    legacyAnswerLetter: letter,
    confidence:
      typeof candidate.confidence === "number" ? candidate.confidence : undefined,
    reasoning_brief:
      typeof candidate.reasoning_brief === "string"
        ? candidate.reasoning_brief
        : undefined,
  };
}

function extractJsonObject(text: string): string | null {
  const match = text.match(/\{[\s\S]*\}/);
  return match?.[0] || null;
}

/** Parses a provider text response: JSON body, `field=value` lines, or marker. */
export function parseMoodleAnswerFromText(
  content: string
): MoodleAnswerResult | null {
  if (!content) return null;

  const jsonText = extractJsonObject(content);
  if (jsonText) {
    try {
      const parsed = parseMoodleAnswerPayload(JSON.parse(jsonText));
      if (parsed) return parsed;
    } catch (error) {
      console.warn("Failed to parse JSON answer content:", error);
    }
  }

  const lineEntries: MoodleAnswerEntry[] = [];
  for (const line of content.split(/\r?\n/)) {
    const match = line.match(/^\s*([\w:.-]{2,})\s*[=:]\s*(.+?)\s*$/);
    if (!match) continue;
    if (match[1].toUpperCase() === "XX_CODE_FINAL_ANSWER_XX") continue;
    lineEntries.push({ field: match[1], value: match[2] });
  }
  if (lineEntries.length > 0) return { answers: lineEntries };

  const markerMatch = content.match(
    /XX_CODE_FINAL_ANSWER_XX:\s*([a-zA-Z])\.\s*(.*)/
  );
  if (!markerMatch) return null;

  return {
    answers: [{ field: "", value: markerMatch[2]?.trim() || markerMatch[1] }],
    legacyAnswerLetter: markerMatch[1].toLowerCase(),
  };
}

/**
 * Repairs answers that carry no usable field id. Legacy provider output has no
 * field at all; some providers echo a wrong id. Both are bound to the obvious
 * field when the question leaves no room for doubt.
 */
export function bindAnswerEntriesToFields(
  result: MoodleAnswerResult,
  question: MoodleQuestionPayload
): MoodleAnswerResult {
  if (question.fields.length === 0) return result;

  const onlyField = question.fields.length === 1 ? question.fields[0] : undefined;
  const firstChoiceField =
    question.fields.find((field) => field.kind !== "text") ?? question.fields[0];
  const knownIds = new Set(question.fields.map((field) => field.id));

  const bound: MoodleAnswerEntry[] = [];
  let changed = false;

  for (const entry of result.answers) {
    if (!entry.field) {
      bound.push({
        field: firstChoiceField.id,
        value: result.legacyAnswerLetter || entry.value,
      });
      changed = true;
      continue;
    }

    if (knownIds.has(entry.field)) {
      bound.push(entry);
      continue;
    }

    if (onlyField) {
      bound.push({ field: onlyField.id, value: entry.value });
      changed = true;
      continue;
    }

    console.warn("AI answered an unknown Moodle field:", entry.field);
    changed = true;
  }

  return changed ? { ...result, answers: bound } : result;
}

export function buildMoodleAutoAnswerUserPrompt(
  question: MoodleQuestionPayload
): string {
  const header = [
    `Question Label: ${question.questionLabel}`,
    `Question Type: ${question.questionType}`,
    "",
    "Question:",
    question.questionText,
  ];

  const notes = question.notes ?? [];
  const noteBlock = notes.length
    ? ["", "Konteks dari halaman:", ...notes.map((note) => `- ${note}`)]
    : [];

  // Essay and image drag-and-drop have no fillable control: the answer stays in
  // the helper panel as text.
  if (question.fields.length === 0) {
    return [
      ...header,
      ...noteBlock,
      "",
      "Soal ini tidak bisa diisi otomatis, jadi tulis jawaban lengkapnya.",
      "Kalau soalnya drag & drop, sebutkan pasangan item → tempatnya supaya bisa dipindah manual.",
      'Balas HANYA dengan JSON: {"answers":[],"answer_text":"<jawaban lengkap>","reasoning_brief":"..."}',
    ].join("\n");
  }

  const fieldBlocks = question.fields.map((field) => {
    const fieldHeader = `[${field.id}] ${field.label}`;

    if (field.kind === "text") {
      return `${fieldHeader}\n  -> jawab dengan teks jawaban final, tanpa penjelasan`;
    }

    const options = (field.options ?? [])
      .map((option) => `  ${option.key.toUpperCase()}. ${option.text}`)
      .join("\n");
    const exampleKey = (field.options?.[0]?.key ?? "a").toUpperCase();
    const rule = field.multiple
      ? `  -> jawab dengan huruf opsi, boleh lebih dari satu, pisahkan dengan koma (contoh: ${field.id}=A,C)`
      : `  -> jawab dengan satu huruf opsi (contoh: ${field.id}=${exampleKey})`;

    return [fieldHeader, options, rule].filter(Boolean).join("\n");
  });

  return [
    ...header,
    ...noteBlock,
    "",
    "Answer fields:",
    fieldBlocks.join("\n\n"),
    "",
    'Balas HANYA dengan JSON: {"answers":["<field_id>=<jawaban>"],"confidence":0.0,"reasoning_brief":"..."}',
    "Sertakan satu entri untuk setiap field di atas.",
  ].join("\n");
}

export function formatMoodleAnswerForDisplay(
  answers: ResolvedMoodleAnswer[],
  reasoning?: string,
  freeText?: string
): string {
  const lines = answers.map(
    (answer) => `- ${answer.field.label}: ${answer.display}`
  );
  const fallback = freeText
    ? "Tipe soal ini belum bisa diisi otomatis, ini jawabannya:"
    : "Udah gw isi sesuai jawaban paling masuk akal.";

  return [reasoning || fallback, freeText, ...lines]
    .filter(Boolean)
    .join("\n\n");
}
