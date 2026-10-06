import test from "node:test";
import assert from "node:assert/strict";

import { classifyMoodleQuestionType } from "../src/lib/content_moodle/question.ts";

const wrapper = (qtype) => `que ${qtype} deferredfeedback notyetanswered`;

test("classifyMoodleQuestionType reads the qtype from the wrapper classes", () => {
	assert.equal(
		classifyMoodleQuestionType(wrapper("multichoice"), { hasCheckbox: false }),
		"multichoice_single"
	);
	assert.equal(
		classifyMoodleQuestionType(wrapper("multichoice"), { hasCheckbox: true }),
		"multichoice_multiple"
	);
	assert.equal(
		classifyMoodleQuestionType(wrapper("truefalse"), { hasCheckbox: false }),
		"truefalse"
	);
	assert.equal(
		classifyMoodleQuestionType(wrapper("shortanswer"), { hasCheckbox: false }),
		"shortanswer"
	);
	assert.equal(
		classifyMoodleQuestionType(wrapper("match"), { hasCheckbox: false }),
		"match"
	);
	assert.equal(
		classifyMoodleQuestionType(wrapper("randomsamatch"), { hasCheckbox: false }),
		"match"
	);
	assert.equal(
		classifyMoodleQuestionType(wrapper("gapselect"), { hasCheckbox: false }),
		"gapselect"
	);
	assert.equal(
		classifyMoodleQuestionType(wrapper("multianswer"), { hasCheckbox: false }),
		"cloze"
	);
});

test("classifyMoodleQuestionType maps calculated variants to numerical", () => {
	for (const qtype of ["numerical", "calculated", "calculatedsimple", "calculatedmulti"]) {
		assert.equal(
			classifyMoodleQuestionType(wrapper(qtype), { hasCheckbox: false }),
			"numerical"
		);
	}
});

test("classifyMoodleQuestionType marks drag-and-drop types correctly", () => {
	assert.equal(
		classifyMoodleQuestionType(wrapper("ddwtos"), { hasCheckbox: false }),
		"ddwtos"
	);
	assert.equal(
		classifyMoodleQuestionType(wrapper("ddimageortext"), { hasCheckbox: false }),
		"ddimageortext"
	);
	assert.equal(
		classifyMoodleQuestionType(wrapper("ddmarker"), { hasCheckbox: false }),
		"unsupported"
	);
	assert.equal(
		classifyMoodleQuestionType(wrapper("essay"), { hasCheckbox: false }),
		"unsupported"
	);
});

test("classifyMoodleQuestionType falls back to the rendered controls", () => {
	assert.equal(classifyMoodleQuestionType("que", { hasCheckbox: true }), "multichoice_multiple");
	assert.equal(classifyMoodleQuestionType("que", { hasCheckbox: false }), "unknown");
	assert.equal(classifyMoodleQuestionType("", { hasCheckbox: false }), "unknown");
});
