import { describe, it, expect } from "vitest";
import { randomInt, randomElement, randomChar, shuffle } from "../src/random";

describe("random", () => {
	describe("randomInt", () => {
		it("returns values in range [0, max)", () => {
			for (let i = 0; i < 100; i++) {
				const val = randomInt(10);
				expect(val).toBeGreaterThanOrEqual(0);
				expect(val).toBeLessThan(10);
			}
		});

		it("throws for non-positive max", () => {
			expect(() => randomInt(0)).toThrow();
			expect(() => randomInt(-5)).toThrow();
		});
	});

	describe("randomElement", () => {
		it("returns an element from the array", () => {
			const arr = ["a", "b", "c", "d"];
			for (let i = 0; i < 50; i++) {
				expect(arr).toContain(randomElement(arr));
			}
		});

		it("throws for empty array", () => {
			expect(() => randomElement([])).toThrow();
		});
	});

	describe("randomChar", () => {
		it("returns a character from the string", () => {
			const str = "abcdef";
			for (let i = 0; i < 50; i++) {
				expect(str).toContain(randomChar(str));
			}
		});

		it("throws for empty string", () => {
			expect(() => randomChar("")).toThrow();
		});
	});

	describe("shuffle", () => {
		it("returns the same array reference", () => {
			const arr = [1, 2, 3, 4, 5];
			const result = shuffle(arr);
			expect(result).toBe(arr);
		});

		it("preserves all elements", () => {
			const arr = [1, 2, 3, 4, 5];
			shuffle(arr);
			expect(arr.sort()).toEqual([1, 2, 3, 4, 5]);
		});
	});
});
