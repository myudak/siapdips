import test from "node:test";
import assert from "node:assert/strict";

import {
	hasMismatchedNumbers,
	isMatchResilient,
	normalizeText,
	parseExpectedAnswers,
} from "../src/lib/content_oracle_academy/matching.ts";

// ---------------------------------------------------------------------------
// normalizeText
// ---------------------------------------------------------------------------

test("normalizeText: null/undefined returns empty string", () => {
	assert.equal(normalizeText(null), "");
	assert.equal(normalizeText(undefined), "");
	assert.equal(normalizeText(""), "");
});

test("normalizeText: trims, lowercases, collapses whitespace", () => {
	assert.equal(normalizeText("  Hello   WORLD  "), "hello world");
});

test("normalizeText: strips instruction suffixes", () => {
	assert.equal(
		normalizeText("What is SQL? (Choose two answers.)"),
		"what is sql?"
	);
	assert.equal(
		normalizeText("Which is correct? (Choose all correct answers.)"),
		"which is correct?"
	);
	assert.equal(
		normalizeText("Which is correct? (Select all correct answers.)"),
		"which is correct?"
	);
});

test("normalizeText: strips (True or False?) variations", () => {
	assert.equal(
		normalizeText("Is SQL a language? (True or False?)"),
		"is sql a language?"
	);
	assert.equal(
		normalizeText("Is SQL a language? True or False?"),
		"is sql a language?"
	);
});

test("normalizeText: removes 'mark for review'", () => {
	assert.equal(
		normalizeText("What is SQL? mark for review"),
		"what is sql?"
	);
});

test("normalizeText: normalizes unicode dashes and quotes", () => {
	assert.equal(normalizeText("hello\u2013world"), "hello-world");
	assert.equal(normalizeText("hello\u2018world\u2019"), "hello'world'");
	assert.equal(normalizeText("hello\u201Cworld\u201D"), 'hello"world"');
});

test("normalizeText: normalizes non-breaking spaces", () => {
	assert.equal(normalizeText("hello\u00A0world"), "hello world");
});

test("normalizeText: normalizes escaped whitespace from QA bank keys", () => {
	const qaKey =
		"what would the following sql statement return?\\nselect count(distinct salary)\\nfrom employees;";
	const pageText = `What would the following SQL statement return?

SELECT COUNT(DISTINCT salary)
FROM employees;`;

	assert.equal(normalizeText(qaKey), normalizeText(pageText));
});

test("normalizeText: strips section prefixes (S4, S6 Q1, S7J Q1, etc.)", () => {
	assert.equal(
		normalizeText("S4 A business rule such as this is best enforced by:"),
		"a business rule such as this is best enforced by:"
	);
	assert.equal(
		normalizeText("S6 Q1 Examine ENTITY CLIENT (#CLIENT ID, FIRST NAME)"),
		"examine entity client (#client id, first name)"
	);
	assert.equal(
		normalizeText("S7J Q1 Evaluate this SQL statement:"),
		"evaluate this sql statement:"
	);
	assert.equal(
		normalizeText("S8 Q1 Which scenarios should be modeled so that historical data is kept?"),
		"which scenarios should be modeled so that historical data is kept?"
	);
	assert.equal(
		normalizeText("S9 Q1 Arc to physical design:"),
		"arc to physical design:"
	);
});

test("normalizeText: strips question number prefixes (8., 10., etc.)", () => {
	assert.equal(
		normalizeText("8. Unique Identifiers:"),
		"unique identifiers:"
	);
	assert.equal(
		normalizeText("10. Unique Identifiers: Mark for Review"),
		"unique identifiers:"
	);
	assert.equal(
		normalizeText("1. A specialized type of software which controls hardware:"),
		"a specialized type of software which controls hardware:"
	);
});

test("normalizeText: strips blog/forum comment artifacts (Balasan Balas ... pukul HH.MM)", () => {
	assert.equal(
		normalizeText("Balasan Balas Unknown2 Mei 2024 pukul 00.05 A correlated subquery is evaluated"),
		"a correlated subquery is evaluated"
	);
	assert.equal(
		normalizeText("Balasan Balas galih6 Juli 2024 pukul 03.29 Which of the following query should you use?"),
		"which of the following query should you use?"
	);
	assert.equal(
		normalizeText("Balasan Balas GenEtika30 Oktober 2024 pukul 00.36 Which statement about subqueries is true?"),
		"which statement about subqueries is true?"
	);
});

test("normalizeText: section prefix followed by number prefix both stripped", () => {
	assert.equal(
		normalizeText("S6 Q1 8. Which of the following are examples of ENTITY: Instance?"),
		"which of the following are examples of entity: instance?"
	);
});

test("normalizeText: does NOT strip legitimate text that happens to start with digit+dot", () => {
	// Full SQL statement that starts with a digit prefix pattern
	assert.equal(
		normalizeText("SELECT 1.0 AS value FROM dual"),
		"select 1.0 as value from dual"
	);
});

test("normalizeText: blog artifact followed by embedded number prefix both stripped", () => {
	// Blog artifacts can have embedded number prefixes like "14." after the timestamp
	// Blog strip should run BEFORE number prefix strip to catch these
	assert.equal(
		normalizeText("Balasan Balas Unknown8 April 2024 pukul 01.34 14. The EMPLOYEES table"),
		"the employees table"
	);
});

// ---------------------------------------------------------------------------
// parseExpectedAnswers
// ---------------------------------------------------------------------------

test("parseExpectedAnswers: single answer returns array of one", () => {
	assert.deepEqual(parseExpectedAnswers("True"), ["true"]);
});

test("parseExpectedAnswers: pipe-separated answers are split", () => {
	assert.deepEqual(parseExpectedAnswers("Intelligence|Knowledge"), [
		"intelligence",
		"knowledge",
	]);
});

test("parseExpectedAnswers: strips leading 'and'/'or' from parts", () => {
	assert.deepEqual(parseExpectedAnswers("Option A|and Option B|or Option C"), [
		"option a",
		"option b",
		"option c",
	]);
});

test("parseExpectedAnswers: Oracle || concat is NOT split into parts", () => {
	// Oracle uses || for string concatenation — must not treat as multi-answer separator
	assert.deepEqual(
		parseExpectedAnswers("last_name||','||first_name"),
		["last_name||','||first_name"]
	);
});

test("parseExpectedAnswers: full SQL with Oracle || returns 1 answer", () => {
	// Regression test: the bug report question
	const sql =
		"SELECT ROWNUM \"Ranking\",last_name||','||first_name \"Employee\", salary \"Salary\" FROM (SELECT last_name, first_name, salary, job_id FROM employees WHERE job_id LIKE 'CLERK' AND department_id = 70 ORDER BY salary) WHERE ROWNUM <=10;";
	const result = parseExpectedAnswers(sql);
	assert.equal(result.length, 1);
	assert.ok(result[0].includes("department_id = 70"));
});

test("parseExpectedAnswers: answer that is literally || returns 1 part", () => {
	// QA bank has entries with value '||' (the Oracle concatenation operator)
	assert.deepEqual(parseExpectedAnswers("||"), ["||"]);
});

test("parseExpectedAnswers: mixed single | and Oracle || split correctly", () => {
	// Edge case: single | separates multi-answer, || is Oracle concat
	// This tests that the regex correctly distinguishes
	assert.deepEqual(
		parseExpectedAnswers("Option A|Option B"),
		["option a", "option b"]
	);
});

// ---------------------------------------------------------------------------
// hasMismatchedNumbers
// ---------------------------------------------------------------------------

test("hasMismatchedNumbers: detects = 7 vs = 70 prefix mismatch", () => {
	assert.equal(
		hasMismatchedNumbers(
			"department_id = 70",
			"department_id = 7"
		),
		true
	);
});

test("hasMismatchedNumbers: equal numbers return false", () => {
	assert.equal(
		hasMismatchedNumbers(
			"WHERE department_id = 70",
			"WHERE department_id = 70"
		),
		false
	);
});

test("hasMismatchedNumbers: no operator-number patterns returns false", () => {
	assert.equal(
		hasMismatchedNumbers("hello world", "hello"),
		false
	);
});

test("hasMismatchedNumbers: salary comparisons also checked", () => {
	assert.equal(
		hasMismatchedNumbers("salary > 5000", "salary > 500"),
		true
	);
});

test("hasMismatchedNumbers: ROWNUM <= 10 vs ROWNUM <= 1", () => {
	assert.equal(
		hasMismatchedNumbers("ROWNUM <= 10", "ROWNUM <= 1"),
		true
	);
});

test("hasMismatchedNumbers: same operator-number pairs return false", () => {
	assert.equal(
		hasMismatchedNumbers(
			"WHERE ROWNUM <= 10 AND department_id = 70",
			"WHERE ROWNUM <= 10"
		),
		false
	);
});

// ---------------------------------------------------------------------------
// isMatchResilient
// ---------------------------------------------------------------------------

test("isMatchResilient: identical strings match", () => {
	assert.equal(
		isMatchResilient("hello world", "hello world"),
		true
	);
});

test("isMatchResilient: department_id = 7 should NOT match department_id = 70", () => {
	// This is the regression test for the false-positive bug
	assert.equal(
		isMatchResilient(
			"department_id = 70",
			"department_id = 7"
		),
		false
	);
});

test("isMatchResilient: simple substring still works (no number conflict)", () => {
	assert.equal(
		isMatchResilient(
			"SELECT last_name, first_name FROM employees WHERE salary > 1000",
			"SELECT last_name, first_name FROM employees"
		),
		true
	);
});

test("isMatchResilient: short strings reject", () => {
	assert.equal(isMatchResilient("abc", "abcdef"), false);
});

test("isMatchResilient: pure numbers reject", () => {
	assert.equal(isMatchResilient("123", "123456"), false);
});

test("isMatchResilient: salary > 500 should NOT match salary > 5000", () => {
	assert.equal(
		isMatchResilient("salary > 5000", "salary > 500"),
		false
	);
});

test("isMatchResilient: ROWNUM <= 10 vs ROWNUM <= 1", () => {
	assert.equal(
		isMatchResilient("ROWNUM <= 10", "ROWNUM <= 1"),
		false
	);
});

test("isMatchResilient: legitimate partial match with same numbers", () => {
	// Both have = 70 so this is a valid partial match
	assert.equal(
		isMatchResilient(
			"SELECT * FROM employees WHERE department_id = 70",
			"department_id = 70"
		),
		true
	);
});

// ---------------------------------------------------------------------------
// Real-world scenario: the failing question from the bug report
// ---------------------------------------------------------------------------

test("REGRESSION: full SQL with department_id = 70 should NOT match department_id = 7", () => {
	const qaAnswer = normalizeText(
		`SELECT ROWNUM "Ranking",last_name||','||first_name "Employee", salary "Salary" FROM (SELECT last_name, first_name, salary, job_id FROM employees WHERE job_id LIKE 'CLERK' AND department_id = 70 ORDER BY salary) WHERE ROWNUM <=10;`
	);

	const choice2 = normalizeText(
		`SELECT ROWNUM "Ranking",last_name||','||first_name "Employee", salary "Salary" FROM (SELECT last_name, first_name, salary, job_id FROM employees WHERE job_id LIKE 'CLERK' AND department_id = 7 ORDER BY salary) WHERE ROWNUM <=10`
	);

	// The QA answer is correct SQL (department_id = 70).
	// Choice 2 on screen has department_id = 7.
	// These should NOT match.
	assert.equal(isMatchResilient(qaAnswer, choice2), false);
});
