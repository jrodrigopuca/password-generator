/**
 * Memorable password generator.
 * Supports three modes: word transform, passphrase, and random.
 */

import { wordsEn } from "./dictionaries/en.js";
import { wordsEs } from "./dictionaries/es.js";
import { randomElement, randomInt } from "./random.js";
import { estimateEntropy, getStrengthLevel } from "./strength.js";
import {
	removeDiacritics,
	applySymbols,
	applyNumbers,
	applyUppercase,
} from "./transforms.js";
import type { GeneratorOptions, GeneratedPassword, Language } from "./types.js";
import { DEFAULT_OPTIONS } from "./types.js";

/** Character sets for random mode */
const CHARS = {
	lower: "abcdefghijklmnopqrstuvwxyz",
	upper: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
	digits: "0123456789",
	symbols: "!@#$%&*?",
	ambiguousLower: "abcdefghjkmnpqrstuvwxyz", // no l, o
	ambiguousUpper: "ABCDEFGHJKLMNPQRSTUVWXYZ", // no I, O
	ambiguousDigits: "23456789", // no 0, 1
};

/**
 * Get the dictionary for a given language.
 */
function getDictionary(lang: Language): readonly string[] {
	return lang === "es" ? wordsEs : wordsEn;
}

/**
 * Filter words by length constraints.
 */
function filterByLength(
	words: readonly string[],
	min: number,
	max: number,
): string[] {
	return words.filter((w) => {
		const len = removeDiacritics(w).length;
		return len >= min && len <= max;
	});
}

/**
 * Generate a password by transforming a single word.
 */
function generateWordPassword(options: GeneratorOptions): GeneratedPassword {
	const dictionary = getDictionary(options.language);
	const candidates = filterByLength(
		dictionary,
		options.length.min,
		options.length.max,
	);

	if (candidates.length === 0) {
		throw new Error(
			`No words found for language "${options.language}" with length ${options.length.min}-${options.length.max}`,
		);
	}

	const original = randomElement(candidates);
	// Remove diacritics first so transforms work on ASCII
	let password = removeDiacritics(original);

	// Apply transforms: symbols → numbers → uppercase
	password = applySymbols(password, options.symbols, options.excludeAmbiguous);
	password = applyNumbers(password, options.numbers, options.excludeAmbiguous);
	password = applyUppercase(password, options.uppercase);

	const entropy = estimateEntropy(password);

	return {
		password,
		original,
		entropy,
		strength: getStrengthLevel(entropy),
		mode: "word",
	};
}

/**
 * Generate a passphrase from multiple words.
 */
function generatePassphrase(options: GeneratorOptions): GeneratedPassword {
	const dictionary = getDictionary(options.language);
	// For passphrase, use shorter words (4-8 chars)
	const candidates = filterByLength(dictionary, 4, 8);

	if (candidates.length === 0) {
		throw new Error(
			`No words found for language "${options.language}" for passphrase`,
		);
	}

	const words: string[] = [];
	for (let i = 0; i < options.wordCount; i++) {
		let word = removeDiacritics(randomElement(candidates));
		// Capitalize first letter of each word
		word = word[0].toUpperCase() + word.slice(1);
		words.push(word);
	}

	let password = words.join(options.separator);

	// Apply minimal transforms for complexity
	if (options.numbers > 0) {
		password = applyNumbers(
			password,
			options.numbers,
			options.excludeAmbiguous,
		);
	}
	if (options.symbols > 0) {
		// Only if separator isn't already a symbol
		const hasSymbolSeparator = /[^a-zA-Z0-9]/.test(options.separator);
		if (!hasSymbolSeparator) {
			password = applySymbols(
				password,
				options.symbols,
				options.excludeAmbiguous,
			);
		}
	}

	const original = words.join(options.separator);
	const entropy = estimateEntropy(password);

	return {
		password,
		original,
		entropy,
		strength: getStrengthLevel(entropy),
		mode: "passphrase",
	};
}

/**
 * Generate a fully random password.
 */
function generateRandomPassword(options: GeneratorOptions): GeneratedPassword {
	const length =
		options.length.min + randomInt(options.length.max - options.length.min + 1);

	let pool: string;
	if (options.excludeAmbiguous) {
		pool =
			CHARS.ambiguousLower +
			CHARS.ambiguousUpper +
			CHARS.ambiguousDigits +
			CHARS.symbols;
	} else {
		pool = CHARS.lower + CHARS.upper + CHARS.digits + CHARS.symbols;
	}

	const chars: string[] = [];
	for (let i = 0; i < length; i++) {
		chars.push(pool[randomInt(pool.length)]);
	}

	// Ensure at least one of each required type
	const ensureOne = (regex: RegExp, charSet: string, arr: string[]): void => {
		if (!regex.test(arr.join(""))) {
			const pos = randomInt(arr.length);
			arr[pos] = charSet[randomInt(charSet.length)];
		}
	};

	const lowerSet = options.excludeAmbiguous
		? CHARS.ambiguousLower
		: CHARS.lower;
	const upperSet = options.excludeAmbiguous
		? CHARS.ambiguousUpper
		: CHARS.upper;
	const digitSet = options.excludeAmbiguous
		? CHARS.ambiguousDigits
		: CHARS.digits;

	ensureOne(/[a-z]/, lowerSet, chars);
	ensureOne(/[A-Z]/, upperSet, chars);
	ensureOne(/[0-9]/, digitSet, chars);
	ensureOne(/[^a-zA-Z0-9]/, CHARS.symbols, chars);

	const password = chars.join("");
	const entropy = estimateEntropy(password);

	return {
		password,
		original: "",
		entropy,
		strength: getStrengthLevel(entropy),
		mode: "random",
	};
}

/**
 * Generate a memorable password.
 *
 * @param userOptions - Partial options to override defaults
 * @returns Generated password with metadata
 *
 * @example
 * ```ts
 * // Simple usage with defaults
 * const result = generate();
 * // → { password: "determ1n@tIon", original: "determination", ... }
 *
 * // Passphrase mode
 * const result = generate({ mode: "passphrase", language: "es" });
 * // → { password: "Bosque-Cam1no-Estrella", original: "Bosque-Camino-Estrella", ... }
 *
 * // Random mode
 * const result = generate({ mode: "random", length: { min: 16, max: 20 } });
 * // → { password: "k#Pm9xR!2vNq8bWs", ... }
 * ```
 */
export function generate(
	userOptions: Partial<GeneratorOptions> = {},
): GeneratedPassword {
	const options: GeneratorOptions = {
		...DEFAULT_OPTIONS,
		...userOptions,
		length: {
			...DEFAULT_OPTIONS.length,
			...userOptions.length,
		},
	};

	switch (options.mode) {
		case "word":
			return generateWordPassword(options);
		case "passphrase":
			return generatePassphrase(options);
		case "random":
			return generateRandomPassword(options);
		default:
			throw new Error(`Unknown mode: ${options.mode}`);
	}
}
