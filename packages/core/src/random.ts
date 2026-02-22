/**
 * Cryptographically secure random utilities.
 * Uses crypto.getRandomValues() instead of Math.random().
 */

/**
 * Returns a cryptographically secure random integer in [0, max).
 */
export function randomInt(max: number): number {
	if (max <= 0) throw new RangeError("max must be positive");
	const array = new Uint32Array(1);
	crypto.getRandomValues(array);
	return array[0] % max;
}

/**
 * Returns a random element from an array.
 */
export function randomElement<T>(arr: readonly T[]): T {
	if (arr.length === 0) throw new RangeError("Array must not be empty");
	return arr[randomInt(arr.length)];
}

/**
 * Returns a random character from a string.
 */
export function randomChar(str: string): string {
	if (str.length === 0) throw new RangeError("String must not be empty");
	return str[randomInt(str.length)];
}

/**
 * Shuffles an array in place using Fisher-Yates with crypto random.
 * Returns the same array reference.
 */
export function shuffle<T>(arr: T[]): T[] {
	for (let i = arr.length - 1; i > 0; i--) {
		const j = randomInt(i + 1);
		[arr[i], arr[j]] = [arr[j], arr[i]];
	}
	return arr;
}
