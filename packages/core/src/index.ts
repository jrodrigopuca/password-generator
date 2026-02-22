/**
 * @memorable-passwords/core
 *
 * Memorable password generator library.
 * Supports word transform, passphrase, and random generation modes.
 */

export { generate } from "./generator";
export { estimateEntropy, getStrengthLevel } from "./strength";
export { removeDiacritics } from "./transforms";
export { wordsEn } from "./dictionaries/en";
export { wordsEs } from "./dictionaries/es";

export type {
	GeneratorOptions,
	GeneratedPassword,
	GenerationMode,
	Language,
	StrengthLevel,
} from "./types";

export { DEFAULT_OPTIONS } from "./types";
