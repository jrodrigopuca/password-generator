/**
 * Character transformation utilities for password generation.
 * Each transform replaces one character in the input text.
 */

import { randomInt } from "./random";

/** Map of lowercase letters to symbol replacements */
const SYMBOL_MAP: Record<string, string> = {
	a: "@",
	c: "(",
	d: ")",
	i: "!",
	l: "/",
	o: "*",
	p: "?",
	s: "$",
	y: "&",
	q: "#",
};

/** Map of lowercase letters to number replacements */
const NUMBER_MAP: Record<string, string> = {
	a: "4",
	b: "8",
	e: "3",
	i: "1",
	g: "6",
	o: "0",
	q: "9",
	s: "5",
	t: "7",
	z: "2",
};

/** Characters considered ambiguous (can be confused visually) */
const AMBIGUOUS_CHARS = new Set(["0", "O", "o", "1", "l", "I"]);

/**
 * Normalize text by removing diacritics (accents).
 * e.g. "determinación" → "determinacion"
 */
export function removeDiacritics(text: string): string {
	return text.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

/**
 * Apply a single character substitution from a mapping.
 * Finds a random character in `text` that exists in `map` and replaces it.
 * Returns the modified text.
 */
function applySubstitution(
	text: string,
	map: Record<string, string>,
	excludeAmbiguous: boolean,
): string {
	const normalized = removeDiacritics(text);

	// Find all positions that can be substituted
	const candidates: number[] = [];
	for (let i = 0; i < normalized.length; i++) {
		const ch = normalized[i].toLowerCase();
		if (map[ch]) {
			const replacement = map[ch];
			if (excludeAmbiguous && AMBIGUOUS_CHARS.has(replacement)) continue;
			candidates.push(i);
		}
	}

	if (candidates.length === 0) return text;

	// Pick a random candidate position
	const idx = candidates[randomInt(candidates.length)];

	const replacement = map[normalized[idx].toLowerCase()];
	return text.substring(0, idx) + replacement + text.substring(idx + 1);
}

/**
 * Replace `count` characters with symbol equivalents.
 */
export function applySymbols(
	text: string,
	count: number,
	excludeAmbiguous: boolean = false,
): string {
	let result = text;
	for (let i = 0; i < count; i++) {
		result = applySubstitution(result, SYMBOL_MAP, excludeAmbiguous);
	}
	return result;
}

/**
 * Replace `count` characters with number equivalents.
 */
export function applyNumbers(
	text: string,
	count: number,
	excludeAmbiguous: boolean = false,
): string {
	let result = text;
	for (let i = 0; i < count; i++) {
		result = applySubstitution(result, NUMBER_MAP, excludeAmbiguous);
	}
	return result;
}

/**
 * Capitalize `count` random lowercase letters.
 */
export function applyUppercase(text: string, count: number): string {
	let result = text;
	for (let n = 0; n < count; n++) {
		// Find lowercase letter positions
		const candidates: number[] = [];
		for (let i = 0; i < result.length; i++) {
			const ch = result[i];
			if (ch >= "a" && ch <= "z") {
				candidates.push(i);
			}
		}
		if (candidates.length === 0) break;

		const idx = candidates[randomInt(candidates.length)];
		result =
			result.substring(0, idx) +
			result[idx].toUpperCase() +
			result.substring(idx + 1);
	}
	return result;
}
