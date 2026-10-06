import test from "node:test";
import assert from "node:assert/strict";

import {
	bindAnswerEntriesToFields,
	buildMoodleAutoAnswerUserPrompt,
	formatMoodleAnswerForDisplay,
	hasDistinguishableOptions,
	parseMoodleAnswerFromText,
	parseMoodleAnswerPayload,
	resolveMoodleAnswers,
	splitAnswerValues,
} from "../src/lib/content_moodle/answer.ts";

const question = {
	questionLabel: "Question 4",
	questionText: "Ibu kota Indonesia?",
	questionType: "multichoice_single",
	fields: [
		{
			id: "q4:1_answer",
			kind: "choice",
			label: "Pilihan ganda",
			options: [
				{ key: "a", text: "Bandung" },
				{ key: "b", text: "Jakarta" },
				{ key: "c", text: "Surabaya" },
			],
		},
	],
};

const checkboxQuestion = {
	questionLabel: "Question 5",
	questionText: "Pilih semua bilangan prima",
	questionType: "multichoice_multiple",
	fields: [
		{
			id: "q5:1_answer",
			kind: "choice",
			label: "Checkbox (boleh lebih dari satu)",
			multiple: true,
			options: [
				{ key: "a", text: "2" },
				{ key: "b", text: "4" },
				{ key: "c", text: "5" },
				{ key: "d", text: "9" },
			],
		},
	],
};

const mixedQuestion = {
	questionLabel: "Question 6",
	questionText: "Lengkapi",
	questionType: "cloze",
	fields: [
		{
			id: "q6:1_sub1",
			kind: "select",
			label: "Dropdown 1",
			options: [
				{ key: "a", text: "HTML" },
				{ key: "b", text: "CSS" },
			],
		},
		{
			id: "q6:1_sub2_answer",
			kind: "text",
			label: "Isian 1",
		},
	],
};

test("parseMoodleAnswerPayload reads field=value string entries", () => {
	const result = parseMoodleAnswerPayload({
		answers: ["q4:1_answer=B", "q6:1_sub2=Jakarta"],
		reasoning_brief: "karena ibu kota",
	});

	assert.deepEqual(result?.answers, [
		{ field: "q4:1_answer", value: "B" },
		{ field: "q6:1_sub2", value: "Jakarta" },
	]);
	assert.equal(result?.reasoning_brief, "karena ibu kota");
});

test("parseMoodleAnswerPayload reads object entries and maps", () => {
	assert.deepEqual(
		parseMoodleAnswerPayload({ answers: [{ field: "f1", value: "A" }] })?.answers,
		[{ field: "f1", value: "A" }]
	);
	assert.deepEqual(parseMoodleAnswerPayload({ answers: { f1: "A", f2: "2" } })?.answers, [
		{ field: "f1", value: "A" },
		{ field: "f2", value: "2" },
	]);
});

test("parseMoodleAnswerPayload keeps legacy answer_letter working", () => {
	const result = parseMoodleAnswerPayload({
		answer_letter: "B",
		answer_text: "Jakarta",
	});

	assert.equal(result?.legacyAnswerLetter, "b");
	assert.deepEqual(result?.answers, [{ field: "", value: "Jakarta" }]);
});

test("parseMoodleAnswerPayload keeps bare values from providers that drop the field id", () => {
	const result = parseMoodleAnswerPayload({ answers: ["B"] });

	assert.deepEqual(result?.answers, [{ field: "", value: "B" }]);
	assert.deepEqual(
		resolveMoodleAnswers(bindAnswerEntriesToFields(result, question), question).map(
			(answer) => answer.optionIndex
		),
		[1]
	);
});

test("parseMoodleAnswerFromText handles JSON, lines, and the legacy marker", () => {
	assert.deepEqual(
		parseMoodleAnswerFromText('{"answers":["f1=A"]}')?.answers,
		[{ field: "f1", value: "A" }]
	);
	assert.deepEqual(parseMoodleAnswerFromText("f1=A\nf2=Jakarta")?.answers, [
		{ field: "f1", value: "A" },
		{ field: "f2", value: "Jakarta" },
	]);

	const marker = parseMoodleAnswerFromText(
		"Alasan singkat.\nXX_CODE_FINAL_ANSWER_XX: b. Jakarta"
	);
	assert.equal(marker?.legacyAnswerLetter, "b");
	assert.deepEqual(marker?.answers, [{ field: "", value: "Jakarta" }]);
});

test("resolveMoodleAnswers matches options by letter and by text", () => {
	assert.deepEqual(
		resolveMoodleAnswers({ answers: [{ field: "q4:1_answer", value: "B" }] }, question).map(
			(answer) => answer.optionIndex
		),
		[1]
	);
	assert.deepEqual(
		resolveMoodleAnswers(
			{ answers: [{ field: "q4:1_answer", value: "Surabaya" }] },
			question
		).map((answer) => answer.optionIndex),
		[2]
	);
});

test("resolveMoodleAnswers keeps checkbox answers on separate options", () => {
	const resolved = resolveMoodleAnswers(
		{ answers: [{ field: "q5:1_answer", value: "A, C" }] },
		checkboxQuestion
	);

	assert.deepEqual(
		resolved.map((answer) => answer.optionIndex),
		[0, 2]
	);
});

test("resolveMoodleAnswers drops unknown fields and unmatched options", () => {
	assert.deepEqual(
		resolveMoodleAnswers({ answers: [{ field: "nope", value: "A" }] }, question),
		[]
	);
	assert.deepEqual(
		resolveMoodleAnswers(
			{ answers: [{ field: "q4:1_answer", value: "Z" }] },
			question
		),
		[]
	);
});

test("resolveMoodleAnswers keeps free text for text fields", () => {
	const resolved = resolveMoodleAnswers(
		{ answers: [{ field: "q6:1_sub2_answer", value: "  Jakarta   Pusat " }] },
		mixedQuestion
	);

	assert.equal(resolved.length, 1);
	assert.equal(resolved[0].text, "Jakarta Pusat");
});

test("splitAnswerValues separates checkbox lists", () => {
	assert.deepEqual(splitAnswerValues("A, C"), ["A", "C"]);
	assert.deepEqual(splitAnswerValues("A dan C"), ["A", "C"]);
	assert.deepEqual(splitAnswerValues("B"), ["B"]);
});

test("hasDistinguishableOptions rejects labels the AI cannot tell apart", () => {
	// The live ddimageortext question labels ten image items "Part of river".
	assert.equal(
		hasDistinguishableOptions([
			{ key: "a", text: "Part of river" },
			{ key: "b", text: "Part of river" },
		]),
		false
	);
	assert.equal(
		hasDistinguishableOptions([
			{ key: "a", text: "Item 1" },
			{ key: "b", text: "Item 2" },
		]),
		false
	);
	assert.equal(
		hasDistinguishableOptions([
			{ key: "a", text: "Belfast" },
			{ key: "b", text: "Derry" },
		]),
		true
	);
	assert.equal(hasDistinguishableOptions([{ key: "a", text: "Only" }]), true);
	assert.equal(hasDistinguishableOptions(undefined), true);
});

test("buildMoodleAutoAnswerUserPrompt carries page context for unfillable types", () => {
	const prompt = buildMoodleAutoAnswerUserPrompt({
		questionLabel: "Question 5",
		questionText: "Drag the words to the correct notepad.",
		questionType: "ddmarker",
		fields: [],
		notes: [
			"Marker yang harus dipasang: Rivers, Volcanoes",
			"Posisi drop zone tidak ada di halaman.",
		],
	});

	assert.match(prompt, /Question Type: ddmarker/);
	assert.match(prompt, /Konteks dari halaman:/);
	assert.match(prompt, /Marker yang harus dipasang: Rivers, Volcanoes/);
	assert.match(prompt, /pasangan item → tempatnya/);
});

test("bindAnswerEntriesToFields points legacy answers at the first choice field", () => {
	const bound = bindAnswerEntriesToFields(
		{ answers: [{ field: "", value: "Jakarta" }], legacyAnswerLetter: "b" },
		mixedQuestion
	);

	assert.deepEqual(bound.answers, [{ field: "q6:1_sub1", value: "b" }]);
});

test("bindAnswerEntriesToFields rebinds a hallucinated id only on single-field questions", () => {
	const rebound = bindAnswerEntriesToFields(
		{ answers: [{ field: "wrong-id", value: "B" }] },
		question
	);

	assert.deepEqual(rebound.answers, [{ field: "q4:1_answer", value: "B" }]);
	assert.deepEqual(
		bindAnswerEntriesToFields(
			{ answers: [{ field: "wrong-id", value: "B" }] },
			mixedQuestion
		).answers,
		[]
	);
});

test("parseMoodleAnswerPayload accepts free-text answers for unfillable types", () => {
	const result = parseMoodleAnswerPayload({
		answers: [],
		answer_text: "Jawaban esai lengkap.",
	});

	assert.deepEqual(result?.answers, []);
	assert.equal(result?.freeText, "Jawaban esai lengkap.");
});

test("buildMoodleAutoAnswerUserPrompt lists every field and its rule", () => {
	const prompt = buildMoodleAutoAnswerUserPrompt(checkboxQuestion);

	assert.match(prompt, /Question Type: multichoice_multiple/);
	assert.match(prompt, /\[q5:1_answer\]/);
	assert.match(prompt, /A\. 2/);
	assert.match(prompt, /boleh lebih dari satu/);
	assert.match(prompt, /q5:1_answer=A,C/);
});

test("buildMoodleAutoAnswerUserPrompt asks for raw text on text fields", () => {
	const prompt = buildMoodleAutoAnswerUserPrompt(mixedQuestion);

	assert.match(prompt, /\[q6:1_sub2_answer\] Isian 1/);
	assert.match(prompt, /teks jawaban final/);
});

test("formatMoodleAnswerForDisplay renders every applied field", () => {
	const resolved = resolveMoodleAnswers(
		{
			answers: [
				{ field: "q5:1_answer", value: "A,C" },
				{ field: "q6:1_sub2_answer", value: "Jakarta" },
			],
			reasoning_brief: "ini alasannya",
		},
		{
			...mixedQuestion,
			fields: [...checkboxQuestion.fields, ...mixedQuestion.fields],
		}
	);

	const text = formatMoodleAnswerForDisplay(resolved, "ini alasannya");

	assert.match(text, /ini alasannya/);
	assert.match(text, /2/);
	assert.match(text, /Jakarta/);
});
