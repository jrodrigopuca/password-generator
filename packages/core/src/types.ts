/** Supported generation modes */
export type GenerationMode = "word" | "passphrase" | "random";

/** Supported languages for word dictionaries */
export type Language = "en" | "es";

/** Strength level of a generated password */
export type StrengthLevel = "weak" | "fair" | "strong" | "very-strong";

/** Options to configure password generation */
export interface GeneratorOptions {
	/** Generation mode (default: "word") */
	mode: GenerationMode;
	/** Language for word/passphrase modes (default: "en") */
	language: Language;
	/** Desired password length — used as target in "random" mode, as filter in "word" mode */
	length: {
		min: number;
		max: number;
	};
	/** Number of symbol substitutions (default: 1) */
	symbols: number;
	/** Number of number substitutions (default: 1) */
	numbers: number;
	/** Number of uppercase substitutions (default: 1) */
	uppercase: number;
	/** Number of words in passphrase mode (default: 3) */
	wordCount: number;
	/** Separator for passphrase mode (default: "-") */
	separator: string;
	/** Exclude ambiguous characters: 0/O, 1/l/I (default: false) */
	excludeAmbiguous: boolean;
}

/** Result of password generation */
export interface GeneratedPassword {
	/** The generated password */
	password: string;
	/** Original word(s) used (empty string for random mode) */
	original: string;
	/** Estimated entropy in bits */
	entropy: number;
	/** Strength level */
	strength: StrengthLevel;
	/** The mode used to generate */
	mode: GenerationMode;
}

/** Default generator options */
export const DEFAULT_OPTIONS: GeneratorOptions = {
	mode: "word",
	language: "en",
	length: { min: 8, max: 15 },
	symbols: 1,
	numbers: 1,
	uppercase: 1,
	wordCount: 3,
	separator: "-",
	excludeAmbiguous: false,
};
