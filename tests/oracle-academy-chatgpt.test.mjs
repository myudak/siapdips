import test from "node:test";
import assert from "node:assert/strict";

import {
	CHATGPT_SEARCH_URL_MAX_LENGTH,
	buildChatGptSearchUrl,
	buildOracleChatGptPrompt,
	buildOracleQuestionCopyText,
	normalizeOraclePromptText,
	shouldUseChatGptClipboardFallback,
} from "../src/lib/content_oracle_academy/chatgpt.ts";

const question = `Examine the data in the PAYMENT table:

PAYMENT_ID	CUSTOMER_ID	PAYMENT_AMOUNT
86590586	8908090	859.00

SELECT customer_id, payment_type
FROM payment
WHERE payment_id = (SELECT payment_id FROM payment);

Which change could correct the problem?`;

const choices = [
	"Remove the parentheses surrounding the nested SELECT statement.",
	"Change the comparison operator to a single-row operator.",
	"Remove the quotes surrounding the date value.",
	"Change the outer query WHERE clause to 'WHERE payment_id IN'.",
];

test("prompt preserves SQL/table structure and choice order", () => {
	const prompt = buildOracleChatGptPrompt({
		question,
		choices,
		mode: "single",
	});

	assert.match(prompt, /PAYMENT_ID\tCUSTOMER_ID\tPAYMENT_AMOUNT/);
	assert.match(prompt, /SELECT customer_id, payment_type\nFROM payment/);
	assert.match(prompt, /Pilih tepat satu jawaban/);
	assert.ok(prompt.indexOf(`A. ${choices[0]}`) < prompt.indexOf(`D. ${choices[3]}`));
});

test("copy text includes question and every labeled choice", () => {
	const copiedText = buildOracleQuestionCopyText(question, choices);

	assert.match(copiedText, /^SOAL:/);
	assert.match(copiedText, /SELECT customer_id, payment_type\nFROM payment/);
	assert.match(copiedText, /PILIHAN JAWABAN:/);
	assert.match(copiedText, new RegExp(`A\\. ${choices[0].replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}`));
	assert.match(copiedText, new RegExp(`D\\. ${choices[3].replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}`));
});

test("multiple choice prompt asks for every correct answer", () => {
	const prompt = buildOracleChatGptPrompt({
		question: "Choose the valid statements.",
		choices: ["Statement one", "Statement two"],
		mode: "multiple",
	});

	assert.match(prompt, /lebih dari satu jawaban benar/);
	assert.match(prompt, /Pilih semua jawaban yang benar/);
});

test("ChatGPT search URL safely encodes prompt characters", () => {
	const prompt = "SELECT * FROM employees\nWHERE name = 'A & B';";
	const url = buildChatGptSearchUrl(prompt);
	const parsed = new URL(url);

	assert.equal(parsed.origin, "https://chatgpt.com");
	assert.equal(parsed.searchParams.get("hints"), "search");
	assert.equal(parsed.searchParams.get("q"), prompt);
});

test("long ChatGPT URL uses clipboard fallback", () => {
	assert.equal(
		shouldUseChatGptClipboardFallback(
			`https://chatgpt.com/?q=${"x".repeat(CHATGPT_SEARCH_URL_MAX_LENGTH)}`
		),
		true
	);
	assert.equal(
		shouldUseChatGptClipboardFallback("https://chatgpt.com/?q=short"),
		false
	);
});

test("prompt text normalizer keeps line structure and removes noisy blanks", () => {
	assert.equal(
		normalizeOraclePromptText("  SELECT 1  \r\n\r\n\r\n  FROM dual  "),
		"SELECT 1\n\nFROM dual"
	);
});
