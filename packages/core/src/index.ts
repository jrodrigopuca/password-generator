/**
 * @memorable-passwords/core
 *
 * Memorable password generator library.
 * Supports word transform, passphrase, and random generation modes.
 */

export { generate } from "./generator.js";
export { estimateEntropy, getStrengthLevel } from "./strength.js";
export { removeDiacritics } from "./transforms.js";
export { wordsEn } from "./dictionaries/en.js";
export { wordsEs } from "./dictionaries/es.js";

export type {
	GeneratorOptions,
	GeneratedPassword,
	GenerationMode,
	Language,
	StrengthLevel,
} from "./types.js";

export { DEFAULT_OPTIONS } from "./types.js";
