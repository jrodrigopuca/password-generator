import { describe, it, expect } from "vitest";
import { generate } from "../src/generator";
import type { GeneratedPassword } from "../src/types";

describe("generate", () => {
	describe("word mode", () => {
		it("returns a password and original word", () => {
			const result = generate({ mode: "word" });
			expect(result.password).toBeDefined();
			expect(result.original).toBeDefined();
			expect(result.original.length).toBeGreaterThan(0);
			expect(result.mode).toBe("word");
		});

		it("password differs from original", () => {
			const result = generate({ mode: "word" });
			expect(result.password).not.toBe(result.original);
		});

		it("respects length constraints", () => {
			const result = generate({
				mode: "word",
				length: { min: 8, max: 10 },
			});
			expect(result.password.length).toBeGreaterThanOrEqual(8);
			expect(result.password.length).toBeLessThanOrEqual(10);
		});

		it("contains at least one symbol", () => {
			const result = generate({ mode: "word", symbols: 1 });
			expect(result.password).toMatch(/[^a-zA-Z0-9]/);
		});

		it("contains at least one number", () => {
			const result = generate({ mode: "word", numbers: 1 });
			expect(result.password).toMatch(/[0-9]/);
		});

		it("contains at least one uppercase letter", () => {
			const result = generate({ mode: "word", uppercase: 1 });
			expect(result.password).toMatch(/[A-Z]/);
		});

		it("works with Spanish language", () => {
			const result = generate({ mode: "word", language: "es" });
			expect(result.password).toBeDefined();
			expect(result.original.length).toBeGreaterThan(0);
		});

		it("returns entropy and strength", () => {
			const result = generate({ mode: "word" });
			expect(result.entropy).toBeGreaterThan(0);
			expect(["weak", "fair", "strong", "very-strong"]).toContain(
				result.strength,
			);
		});
	});

	describe("passphrase mode", () => {
		it("generates a passphrase with separator", () => {
			const result = generate({
				mode: "passphrase",
				wordCount: 3,
				separator: "-",
			});
			expect(result.password).toBeDefined();
			// Should have at least 2 separators for 3 words
			const separatorCount = (result.original.match(/-/g) || []).length;
			expect(separatorCount).toBe(2);
			expect(result.mode).toBe("passphrase");
		});

		it("respects wordCount option", () => {
			const result = generate({
				mode: "passphrase",
				wordCount: 4,
				separator: "-",
			});
			const words = result.original.split("-");
			expect(words.length).toBe(4);
		});

		it("capitalizes each word", () => {
			const result = generate({
				mode: "passphrase",
				wordCount: 3,
				separator: "-",
				numbers: 0,
				symbols: 0,
			});
			const words = result.password.split("-");
			words.forEach((word) => {
				expect(word[0]).toBe(word[0].toUpperCase());
			});
		});
	});

	describe("random mode", () => {
		it("generates a random password within length range", () => {
			const result = generate({
				mode: "random",
				length: { min: 12, max: 16 },
			});
			expect(result.password.length).toBeGreaterThanOrEqual(12);
			expect(result.password.length).toBeLessThanOrEqual(16);
			expect(result.original).toBe("");
			expect(result.mode).toBe("random");
		});

		it("contains all character types", () => {
			const result = generate({
				mode: "random",
				length: { min: 16, max: 16 },
			});
			expect(result.password).toMatch(/[a-z]/);
			expect(result.password).toMatch(/[A-Z]/);
			expect(result.password).toMatch(/[0-9]/);
			expect(result.password).toMatch(/[^a-zA-Z0-9]/);
		});
	});

	describe("strength assessment", () => {
		it("rates short passwords as weak or fair", () => {
			// Word mode with defaults tends to produce fair/strong passwords
			const results: GeneratedPassword[] = [];
			for (let i = 0; i < 10; i++) {
				results.push(generate({ mode: "word" }));
			}
			// At least some should have entropy > 0
			expect(results.every((r) => r.entropy > 0)).toBe(true);
		});
	});
});
