/**
 * Normalize text: trim, collapse spaces, lowercase, strip prefixes/suffixes.
 *
 * Strips:
 * - instruction suffixes (choose N answers, select N answers, etc.)
 * - "(True or False?)" variations
 * - "Mark for review"
 * - section prefixes (S4, S6 Q1, S7J Q15, etc.) — scraping artifacts
 * - question number prefixes (8., 10., etc.) — UI numbering
 * - blog/forum comment artifacts ("Balasan Balas ... pukul HH.MM")
 */
export function normalizeText(txt: string | null | undefined): string {
	if (!txt) return "";

	return txt
		// Imported QA keys may contain literal "\\n" instead of real line breaks.
		.replace(/\\[nrt]/gi, " ")
		// Convert non-breaking spaces to normal spaces
		.replace(/\u00A0/g, " ")
		// Normalize dashes/quotes to ASCII
		.replace(/[\u2013\u2014]/g, "-")
		.replace(/[\u2018\u2019]/g, "'")
		.replace(/[\u201C\u201D]/g, '"')
		// Strip common instruction suffixes to make matching incredibly resilient
		.replace(/\s*\(\s*choose\s+\w+\s*answers?\.?\s*\)/gi, "")
		.replace(/\s*\(\s*select\s+\w+\s*answers?\.?\s*\)/gi, "")
		.replace(/\s*\(\s*choose\s+\w+\.?\s*\)/gi, "")
		.replace(/\s*\(\s*select\s+\w+\.?\s*\)/gi, "")
		.replace(/\s*\(\s*choose\s+all\s+correct\s+answers?\.?\s*\)/gi, "")
		.replace(/\s*\(\s*select\s+all\s+correct\s+answers?\.?\s*\)/gi, "")
		// Strip (True or False?) or standalone True or False? suffix so that keys
		// with or without parentheses always match the CE page text.
		.replace(/\s*\(\s*true\s+or\s+false\?\)\s*/gi, "")
		.replace(/\s*true\s+or\s+false\?\s*/gi, "")
		.replace(/\s*mark\s+for\s+review/gi, "")
		// Strip section prefixes: S4, S6 Q1, S7J Q15, S8 Q1, S9 Q1, etc.
		// These are organisational labels added during scraping, not part of the actual question.
		.replace(/^\s*s\d+[a-z]?\s*(?:q\d+\s*)?/i, "")
		// Strip blog/forum comment artifacts: "Balasan Balas ... pukul HH.MM " prefix
		// Some questions were scraped from blog comment threads and have this prefix.
		.replace(/^\s*balasan\s+balas\s+.+?\d{1,2}\.\d{2}\s*/i, "")
		// Strip question number prefixes: 8., 10., 1., etc.
		// Oracle Academy quiz pages number questions in the UI; the numbers are not part of the text.
		// Must come AFTER blog artifact strip so that numbers in blog-recovered text are also cleaned.
		.replace(/^\s*\d+\.\s+/, "")
		// Collapse multiple whitespace into a single space
		.replace(/\s+/g, " ")
		// Normalize curly quotes to straight quotes
		.replace(/[""]/g, '"')
		.replace(/[']/g, "'")
		.trim()
		.toLowerCase();
}

/**
 * Match a single pipe `|` that is NOT part of `||` (double pipe).
 *
 * Oracle SQL uses `||` for string concatenation, so we must avoid splitting on
 * double pipes that happen to appear in answer text.
 */
const SINGLE_PIPE = /(?<!\|)\|(?!\|)/;

/**
 * Split pipe-delimited answer string into normalized expected answers.
 *
 * Multiple answers are separated by single `|`.
 * Oracle `||` concatenation operators are preserved and never split.
 * Single answers are returned as a one-element array.
 */
export function parseExpectedAnswers(answerRaw: string): string[] {
	const normalized = normalizeText(answerRaw);
	if (!normalized) return [];

	if (SINGLE_PIPE.test(normalized)) {
		return normalized
			.split(SINGLE_PIPE)
			.map((part) => part.trim().replace(/^(and|or)\s+/, ""))
			.filter(Boolean);
	}

	// Default: treat the whole normalized string as a single expected answer.
	return [normalized];
}

/**
 * Check if two strings differ in numeric values (e.g. `= 7` vs `= 70`).
 *
 * Extracts `{operator}{spaces}{number}` patterns from both strings.
 * If one number is a prefix of another but they aren't equal, a mismatch exists.
 *
 * Example: `department_id = 7` vs `department_id = 70`
 *   → extract `7` and `70`
 *   → `70 !== 7` and `70.startsWith("7")` → true (mismatch)
 */
export function hasMismatchedNumbers(s1: string, s2: string): boolean {
	const opNumPattern = /(?:<=?|>=?|!=|<>|=)\s*(\d+)/gi;

	const getOperatorNumbers = (s: string): string[] => {
		const result: string[] = [];
		let m: RegExpExecArray | null;
		while ((m = opNumPattern.exec(s)) !== null) {
			result.push(m[1]);
		}
		return result;
	};

	const nums1 = getOperatorNumbers(s1);
	const nums2 = getOperatorNumbers(s2);

	if (nums1.length === 0 || nums2.length === 0) return false;

	for (const n1 of nums1) {
		for (const n2 of nums2) {
			if (n1 !== n2 && (n1.startsWith(n2) || n2.startsWith(n1))) {
				return true;
			}
		}
	}

	return false;
}

/**
 * Resilient string comparison that avoids false positives on numeric values.
 *
 * Returns true if the strings are equal or one contains the other,
 * but rejects cases where numeric values differ (e.g. `= 7` vs `= 70`).
 */
export function isMatchResilient(str1: string, str2: string): boolean {
	const s1 = str1.trim();
	const s2 = str2.trim();
	if (s1 === s2) return true;

	// Avoid substring matching for short strings or pure numbers
	const isShortOrNumeric =
		s1.length <= 3 ||
		s2.length <= 3 ||
		/^\d+$/.test(s1) ||
		/^\d+$/.test(s2);
	if (isShortOrNumeric) return false;

	// Reject matches where numbers differ (e.g. `= 7` vs `= 70`)
	if (hasMismatchedNumbers(s1, s2)) return false;

	return s1.includes(s2) || s2.includes(s1);
}
