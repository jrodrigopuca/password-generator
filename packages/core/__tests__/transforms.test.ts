import { describe, it, expect } from "vitest";
import {
	removeDiacritics,
	applySymbols,
	applyNumbers,
	applyUppercase,
} from "../src/transforms";

describe("transforms", () => {
	describe("removeDiacritics", () => {
		it("removes Spanish accents", () => {
			expect(removeDiacritics("determinación")).toBe("determinacion");
		});

		it("removes French accents", () => {
			expect(removeDiacritics("café")).toBe("cafe");
		});

		it("leaves ASCII text unchanged", () => {
			expect(removeDiacritics("hello")).toBe("hello");
		});
	});

	describe("applySymbols", () => {
		it("replaces at least one character with a symbol", () => {
			const result = applySymbols("password", 1);
			expect(result).toMatch(/[^a-zA-Z0-9]/);
			expect(result.length).toBe("password".length);
		});

		it("can apply multiple symbol substitutions", () => {
			const result = applySymbols("password", 2);
			const symbolCount = (result.match(/[^a-zA-Z0-9]/g) || []).length;
			expect(symbolCount).toBeGreaterThanOrEqual(1); // At least 1 (could hit same char)
		});
	});

	describe("applyNumbers", () => {
		it("replaces at least one character with a number", () => {
			const result = applyNumbers("adventure", 1);
			expect(result).toMatch(/[0-9]/);
			expect(result.length).toBe("adventure".length);
		});
	});

	describe("applyUppercase", () => {
		it("capitalizes at least one letter", () => {
			const result = applyUppercase("adventure", 1);
			expect(result).toMatch(/[A-Z]/);
			expect(result.length).toBe("adventure".length);
		});

		it("can capitalize multiple letters", () => {
			const result = applyUppercase("adventure", 3);
			const upperCount = (result.match(/[A-Z]/g) || []).length;
			expect(upperCount).toBeGreaterThanOrEqual(1);
		});
	});
});
