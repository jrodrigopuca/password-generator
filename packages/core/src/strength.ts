/**
 * Password strength estimation based on entropy.
 */

import type { StrengthLevel } from "./types.js";

/**
 * Estimate the entropy of a password in bits.
 * Uses character pool size and length.
 */
export function estimateEntropy(password: string): number {
	let poolSize = 0;
	const checks = {
		lower: /[a-z]/,
		upper: /[A-Z]/,
		digits: /[0-9]/,
		symbols: /[^a-zA-Z0-9]/,
	};

	if (checks.lower.test(password)) poolSize += 26;
	if (checks.upper.test(password)) poolSize += 26;
	if (checks.digits.test(password)) poolSize += 10;
	if (checks.symbols.test(password)) poolSize += 32;

	if (poolSize === 0) return 0;
	return Math.floor(password.length * Math.log2(poolSize));
}

/**
 * Map entropy to a human-readable strength level.
 */
export function getStrengthLevel(entropy: number): StrengthLevel {
	if (entropy < 36) return "weak";
	if (entropy < 60) return "fair";
	if (entropy < 80) return "strong";
	return "very-strong";
}
