export interface MoodleChatGptField {
  id: string;
  label: string;
  kind: "choice" | "select" | "text";
  multiple?: boolean;
  options?: Array<{ key: string; text: string }>;
}

export interface MoodleChatGptPromptPayload {
  questionLabel: string;
  questionText: string;
  /** Empty for question types without a fillable control. */
  fields: MoodleChatGptField[];
  /** Extra page context for question types that cannot be filled in. */
  notes?: string[];
}

export const MOODLE_CHATGPT_HOME_URL = "https://chatgpt.com/";
export const MOODLE_CHATGPT_URL_MAX_LENGTH = 7800;

export function normalizeMoodlePromptText(value: string): string {
  return value
    .replace(/\r\n?/g, "\n")
    .replace(/\u00a0/g, " ")
    .split("\n")
    .map((line) => line.replace(/[ \t]+$/g, "").trimStart())
    .join("\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function describeFieldInstruction(field: MoodleChatGptField): string {
  if (field.kind === "text") {
    return "Jawab dengan teks jawaban final saja, tanpa penjelasan.";
  }
  if (field.multiple) {
    return "Soal ini dapat memiliki lebih dari satu jawaban benar. Pilih semua jawaban yang benar.";
  }
  if (field.kind === "select") {
    return "Pilih satu opsi untuk setiap dropdown.";
  }
  return "Pilih tepat satu jawaban yang paling benar.";
}

function formatField(field: MoodleChatGptField): string {
  const options = (field.options ?? [])
    .map(({ key, text }) => {
      const label = normalizeMoodlePromptText(text).replace(/\s*\n\s*/g, " ");
      return label ? `${key.trim().toUpperCase()}. ${label}` : "";
    })
    .filter(Boolean)
    .join("\n");

  return [`[${field.id}] ${field.label}`, describeFieldInstruction(field), options]
    .filter(Boolean)
    .join("\n");
}

function formatExpectedAnswerLine(field: MoodleChatGptField): string {
  if (field.kind === "text") return `- ${field.id}: [teks jawaban]`;
  if (field.multiple) return `- ${field.id}: [huruf pilihan, pisahkan dengan koma]`;
  return `- ${field.id}: [huruf pilihan]`;
}

export function buildMoodleChatGptPrompt({
  questionLabel,
  questionText,
  fields,
  notes,
}: MoodleChatGptPromptPayload): string {
  const noteBlock = notes?.length
    ? ["", "KONTEKS DARI HALAMAN:", ...notes.map((note) => `- ${note}`)]
    : [];

  return [
    "Kamu adalah tutor yang membantu menjawab soal kuis Moodle.",
    "Analisis soal berdasarkan konsep yang relevan dan gunakan pilihan jawaban yang tersedia.",
    "",
    `SOAL (${normalizeMoodlePromptText(questionLabel)}):`,
    normalizeMoodlePromptText(questionText),
    ...noteBlock,
    "",
    "JAWABAN YANG DIMINTA:",
    fields.map(formatField).join("\n\n") ||
      "Soal ini tidak punya kolom jawaban otomatis. Tulis jawaban lengkapnya, dan untuk soal drag & drop sebutkan pasangan item → tempatnya.",
    "",
    "Tutup jawaban dengan format ini:",
    ...fields.map(formatExpectedAnswerLine),
    "",
    "Alasan: [penjelasan singkat dan jelas]",
  ].join("\n");
}

export function buildMoodleChatGptSearchUrl(prompt: string): string {
  return `https://chatgpt.com/?hints=search&q=${encodeURIComponent(prompt)}`;
}

export function shouldUseMoodleChatGptClipboardFallback(url: string): boolean {
  return url.length > MOODLE_CHATGPT_URL_MAX_LENGTH;
}
