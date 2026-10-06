export type MoodleChatGptChoiceMode = "single" | "multiple" | "unknown";

export interface MoodleChatGptOption {
  key: string;
  text: string;
}

export interface MoodleChatGptPromptPayload {
  questionLabel: string;
  questionText: string;
  options: MoodleChatGptOption[];
  mode: MoodleChatGptChoiceMode;
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

export function buildMoodleChatGptPrompt({
  questionLabel,
  questionText,
  options,
  mode,
}: MoodleChatGptPromptPayload): string {
  const choiceInstruction =
    mode === "single"
      ? "Pilih tepat satu jawaban yang paling benar."
      : mode === "multiple"
        ? "Soal ini dapat memiliki lebih dari satu jawaban benar. Pilih semua jawaban yang benar."
        : "Tentukan apakah soal meminta satu atau beberapa jawaban, lalu pilih jawaban yang benar.";

  const formattedOptions = options
    .map(({ key, text }) => ({
      key: key.trim().toUpperCase(),
      text: normalizeMoodlePromptText(text).replace(/\s*\n\s*/g, " "),
    }))
    .filter(({ key, text }) => key && text)
    .map(({ key, text }) => `${key}. ${text}`)
    .join("\n");

  return [
    "Kamu adalah tutor yang membantu menjawab soal kuis Moodle.",
    "Analisis soal berdasarkan konsep yang relevan dan gunakan pilihan jawaban yang tersedia.",
    choiceInstruction,
    "",
    `SOAL (${normalizeMoodlePromptText(questionLabel)}):`,
    normalizeMoodlePromptText(questionText),
    "",
    "PILIHAN JAWABAN:",
    formattedOptions,
    "",
    "Berikan jawaban dalam format:",
    "Jawaban final: [huruf pilihan]. [teks jawaban]",
    "Alasan: [penjelasan singkat dan jelas]",
  ].join("\n");
}

export function buildMoodleChatGptSearchUrl(prompt: string): string {
  return `https://chatgpt.com/?hints=search&q=${encodeURIComponent(prompt)}`;
}

export function shouldUseMoodleChatGptClipboardFallback(url: string): boolean {
  return url.length > MOODLE_CHATGPT_URL_MAX_LENGTH;
}
