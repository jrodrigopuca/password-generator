import { generate } from "@memorable-passwords/core";
import type { GenerationMode, Language } from "@memorable-passwords/core";

// DOM elements
const passwordInput = document.getElementById("password") as HTMLInputElement;
const originalLabel = document.getElementById("original") as HTMLElement;
const btnGenerate = document.getElementById(
	"btn-generate",
) as HTMLButtonElement;
const btnCopy = document.getElementById("btn-copy") as HTMLButtonElement;
const strengthFill = document.getElementById("strength-fill") as HTMLElement;
const strengthText = document.getElementById("strength-text") as HTMLElement;
const strengthEntropy = document.getElementById(
	"strength-entropy",
) as HTMLElement;
const optMode = document.getElementById("opt-mode") as HTMLSelectElement;
const optLanguage = document.getElementById(
	"opt-language",
) as HTMLSelectElement;

/**
 * Generate a new password and update the UI.
 */
function generatePassword(): void {
	const mode = optMode.value as GenerationMode;
	const language = optLanguage.value as Language;

	const result = generate({ mode, language });

	passwordInput.value = result.password;

	if (result.original) {
		originalLabel.textContent = result.original;
		originalLabel.style.display = "block";
	} else {
		originalLabel.style.display = "none";
	}

	// Update strength indicator
	strengthFill.setAttribute("data-level", result.strength);
	const labels: Record<string, string> = {
		weak: "Weak",
		fair: "Fair",
		strong: "Strong",
		"very-strong": "Very strong",
	};
	strengthText.textContent = labels[result.strength];
	strengthEntropy.textContent = `${result.entropy} bits`;
}

/**
 * Copy the current password to clipboard.
 */
async function copyPassword(): Promise<void> {
	if (!passwordInput.value) return;

	try {
		await navigator.clipboard.writeText(passwordInput.value);
		btnCopy.textContent = "✅";
		btnCopy.classList.add("copied");
		setTimeout(() => {
			btnCopy.textContent = "📋";
			btnCopy.classList.remove("copied");
		}, 1500);
	} catch {
		// Fallback for older browsers
		passwordInput.select();
		document.execCommand("copy");
	}
}

/**
 * Save current preferences to storage.
 */
function savePreferences(): void {
	const prefs = {
		mode: optMode.value,
		language: optLanguage.value,
	};

	if (typeof chrome !== "undefined" && chrome.storage?.local) {
		chrome.storage.local.set({ preferences: prefs });
	} else {
		localStorage.setItem("mp-preferences", JSON.stringify(prefs));
	}
}

/**
 * Load saved preferences and apply them to the UI.
 */
async function loadPreferences(): Promise<void> {
	try {
		if (typeof chrome !== "undefined" && chrome.storage?.local) {
			const data = await chrome.storage.local.get("preferences");
			if (data.preferences) {
				optMode.value = data.preferences.mode || "word";
				optLanguage.value = data.preferences.language || "en";
			}
		} else {
			const stored = localStorage.getItem("mp-preferences");
			if (stored) {
				const prefs = JSON.parse(stored);
				optMode.value = prefs.mode || "word";
				optLanguage.value = prefs.language || "en";
			}
		}
	} catch {
		// Use defaults
	}
}

// Event listeners
btnGenerate.addEventListener("click", () => {
	generatePassword();
	savePreferences();
});

btnCopy.addEventListener("click", copyPassword);

optMode.addEventListener("change", () => {
	generatePassword();
	savePreferences();
});

optLanguage.addEventListener("change", () => {
	generatePassword();
	savePreferences();
});

// Initialize
loadPreferences().then(() => generatePassword());
