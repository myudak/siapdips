export type OracleChoiceMode = "single" | "multiple" | "unknown";

export interface OracleChatGptPromptPayload {
	question: string;
	choices: string[];
	mode: OracleChoiceMode;
}

export const CHATGPT_HOME_URL = "https://chatgpt.com/";
export const CHATGPT_SEARCH_URL_MAX_LENGTH = 7800;

export function normalizeOraclePromptText(value: string): string {
	return value
		.replace(/\r\n?/g, "\n")
		.replace(/\u00a0/g, " ")
		.split("\n")
		.map((line) => line.replace(/[ \t]+$/g, "").trimStart())
		.join("\n")
		.replace(/\n{3,}/g, "\n\n")
		.trim();
}

function getChoiceLabel(index: number): string {
	let label = "";
	let value = index + 1;

	while (value > 0) {
		value -= 1;
		label = String.fromCharCode(65 + (value % 26)) + label;
		value = Math.floor(value / 26);
	}

	return label;
}

function formatOracleChoices(choices: string[]): string {
	return choices
		.map((choice) => normalizeOraclePromptText(choice).replace(/\s*\n\s*/g, " "))
		.filter(Boolean)
		.map((choice, index) => `${getChoiceLabel(index)}. ${choice}`)
		.join("\n");
}

export function buildOracleQuestionCopyText(
	question: string,
	choices: string[]
): string {
	return [
		"SOAL:",
		normalizeOraclePromptText(question),
		"",
		"PILIHAN JAWABAN:",
		formatOracleChoices(choices),
	].join("\n");
}

export function buildOracleChatGptPrompt({
	question,
	choices,
	mode,
}: OracleChatGptPromptPayload): string {
	const cleanQuestion = normalizeOraclePromptText(question);

	const choiceInstruction =
		mode === "single"
			? "Pilih tepat satu jawaban yang paling benar."
			: mode === "multiple"
				? "Soal ini dapat memiliki lebih dari satu jawaban benar. Pilih semua jawaban yang benar."
				: "Tentukan apakah soal meminta satu atau beberapa jawaban, lalu pilih jawaban yang benar.";

	const formattedChoices = formatOracleChoices(choices);

	return [
		"Kamu adalah tutor Oracle Database Programming with SQL.",
		"Analisis soal berikut berdasarkan konsep Oracle SQL yang benar.",
		choiceInstruction,
		"",
		"SOAL:",
		cleanQuestion,
		"",
		"PILIHAN JAWABAN:",
		formattedChoices,
		"",
		"Berikan jawaban dalam format:",
		"Jawaban final: [huruf pilihan]. [teks jawaban]",
		"Alasan: [penjelasan singkat dan jelas]",
	].join("\n");
}

export function buildChatGptSearchUrl(prompt: string): string {
	return `https://chatgpt.com/?hints=search&q=${encodeURIComponent(prompt)}`;
}

export function shouldUseChatGptClipboardFallback(url: string): boolean {
	return url.length > CHATGPT_SEARCH_URL_MAX_LENGTH;
}
