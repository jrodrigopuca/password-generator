/**
 * Lightweight i18n for the Memorable Passwords UI.
 *
 * Usage:
 *   import { t, applyI18n } from "./i18n";
 *   applyI18n("es");            // updates all [data-i18n] elements
 *   showToast(t("copied"));     // returns translated string
 */

export type UILanguage = "en" | "es";

export interface Translations {
	// Header
	title: string;
	// Password input
	placeholder: string;
	copyTooltip: string;
	// Button
	generate: string;
	// Options labels
	mode: string;
	language: string;
	// Mode options
	modeWord: string;
	modePassphrase: string;
	modeRandom: string;
	// Advanced
	advanced: string;
	symbols: string;
	numbers: string;
	uppercase: string;
	words: string;
	excludeAmbiguous: string;
	// History
	history: string;
	// Strength
	weak: string;
	fair: string;
	strong: string;
	veryStrong: string;
	// Toast
	copied: string;
	// Footer
	footer: string;
}

const en: Translations = {
	title: "Memorable Passwords",
	placeholder: "Click Generate…",
	copyTooltip: "Copy to clipboard",
	generate: "Generate",
	mode: "Mode",
	language: "Language",
	modeWord: "Word",
	modePassphrase: "Passphrase",
	modeRandom: "Random",
	advanced: "Advanced",
	symbols: "Symbols",
	numbers: "Numbers",
	uppercase: "Uppercase",
	words: "Words",
	excludeAmbiguous: "Exclude ambiguous (0/O, 1/l/I)",
	history: "History",
	weak: "Weak",
	fair: "Fair",
	strong: "Strong",
	veryStrong: "Very strong",
	copied: "Copied!",
	footer: "Memorable Passwords v2.0",
};

const es: Translations = {
	title: "Memorable Passwords",
	placeholder: "Clic en Generar…",
	copyTooltip: "Copiar al portapapeles",
	generate: "Generar",
	mode: "Modo",
	language: "Idioma",
	modeWord: "Palabra",
	modePassphrase: "Frase",
	modeRandom: "Aleatorio",
	advanced: "Avanzado",
	symbols: "Símbolos",
	numbers: "Números",
	uppercase: "Mayúsculas",
	words: "Palabras",
	excludeAmbiguous: "Excluir ambiguos (0/O, 1/l/I)",
	history: "Historial",
	weak: "Débil",
	fair: "Aceptable",
	strong: "Fuerte",
	veryStrong: "Muy fuerte",
	copied: "¡Copiado!",
	footer: "Memorable Passwords v2.0",
};

const translations: Record<UILanguage, Translations> = { en, es };

let currentLang: UILanguage = "en";

/**
 * Get the current translations object.
 */
export function getStrings(): Translations {
	return translations[currentLang];
}

/**
 * Translate a single key.
 */
export function t(key: keyof Translations): string {
	return translations[currentLang][key];
}

/**
 * Get strength label for a given level in the current language.
 */
export function strengthLabel(
	level: "weak" | "fair" | "strong" | "very-strong",
): string {
	const map: Record<string, keyof Translations> = {
		weak: "weak",
		fair: "fair",
		strong: "strong",
		"very-strong": "veryStrong",
	};
	return t(map[level]);
}

/**
 * Apply translations to all elements with `data-i18n` attributes.
 *
 * Supported attributes:
 *   data-i18n="key"                → sets textContent
 *   data-i18n-placeholder="key"    → sets placeholder
 *   data-i18n-title="key"          → sets title
 *   data-i18n-aria-label="key"     → sets aria-label
 */
export function applyI18n(lang: UILanguage): void {
	currentLang = lang;
	const strings = translations[lang];

	// Update <html lang>
	document.documentElement.lang = lang;

	// textContent
	document.querySelectorAll<HTMLElement>("[data-i18n]").forEach((el) => {
		const key = el.dataset.i18n as keyof Translations;
		if (strings[key] !== undefined) {
			el.textContent = strings[key];
		}
	});

	// placeholder
	document
		.querySelectorAll<HTMLInputElement>("[data-i18n-placeholder]")
		.forEach((el) => {
			const key = el.dataset.i18nPlaceholder as keyof Translations;
			if (strings[key] !== undefined) {
				el.placeholder = strings[key];
			}
		});

	// title
	document.querySelectorAll<HTMLElement>("[data-i18n-title]").forEach((el) => {
		const key = el.dataset.i18nTitle as keyof Translations;
		if (strings[key] !== undefined) {
			el.title = strings[key];
		}
	});

	// aria-label
	document
		.querySelectorAll<HTMLElement>("[data-i18n-aria-label]")
		.forEach((el) => {
			const key = el.dataset.i18nAriaLabel as keyof Translations;
			if (strings[key] !== undefined) {
				el.setAttribute("aria-label", strings[key]);
			}
		});
}
