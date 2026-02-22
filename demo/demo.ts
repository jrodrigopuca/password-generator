import "../packages/extension/src/popup/popup.css";
import { generate } from "../packages/core/src/index";
import type {
	GeneratedPassword,
	GenerationMode,
	Language,
} from "../packages/core/src/types";
import {
	applyI18n,
	strengthLabel,
	t,
} from "../packages/extension/src/popup/i18n";
import type { UILanguage } from "../packages/extension/src/popup/i18n";

// ---------------------------------------------------------------------------
// DOM elements
// ---------------------------------------------------------------------------
const $ = <T extends HTMLElement>(id: string): T =>
	document.getElementById(id) as T;

const passwordInput = $<HTMLInputElement>("password");
const originalLabel = $<HTMLElement>("original");
const btnGenerate = $<HTMLButtonElement>("btn-generate");
const btnCopy = $<HTMLButtonElement>("btn-copy");
const strengthFill = $<HTMLElement>("strength-fill");
const strengthText = $<HTMLElement>("strength-text");
const strengthEntropy = $<HTMLElement>("strength-entropy");
const optMode = $<HTMLSelectElement>("opt-mode");
const optLanguage = $<HTMLSelectElement>("opt-language");

// Advanced
const advancedToggle = $<HTMLButtonElement>("advanced-toggle");
const advancedPanel = $<HTMLElement>("advanced-panel");
const optSymbols = $<HTMLInputElement>("opt-symbols");
const optNumbers = $<HTMLInputElement>("opt-numbers");
const optUppercase = $<HTMLInputElement>("opt-uppercase");
const optWordcount = $<HTMLInputElement>("opt-wordcount");
const optAmbiguous = $<HTMLInputElement>("opt-ambiguous");

// History
const historyToggle = $<HTMLButtonElement>("history-toggle");
const historyList = $<HTMLUListElement>("history-list");
const historyCount = $<HTMLElement>("history-count");

// Toast
const toast = $<HTMLElement>("toast");

// ---------------------------------------------------------------------------
// Session history
// ---------------------------------------------------------------------------
const MAX_HISTORY = 25;
const sessionHistory: { password: string; mode: string; time: number }[] = [];

function pushHistory(result: GeneratedPassword): void {
	sessionHistory.unshift({
		password: result.password,
		mode: result.mode,
		time: Date.now(),
	});
	if (sessionHistory.length > MAX_HISTORY) sessionHistory.pop();
	renderHistory();
}

function renderHistory(): void {
	historyCount.textContent = String(sessionHistory.length);
	historyList.innerHTML = "";
	for (const entry of sessionHistory) {
		const li = document.createElement("li");
		li.className = "history-item";

		const span = document.createElement("span");
		span.className = "history-password";
		span.textContent = entry.password;

		const copyBtn = document.createElement("button");
		copyBtn.className = "btn-icon";
		copyBtn.textContent = "📋";
		copyBtn.title = "Copy";
		copyBtn.addEventListener("click", () => copyToClipboard(entry.password));

		li.append(span, copyBtn);
		historyList.appendChild(li);
	}
}

// ---------------------------------------------------------------------------
// Toast
// ---------------------------------------------------------------------------
let toastTimer: ReturnType<typeof setTimeout> | undefined;

function showToast(message: string, durationMs = 2000): void {
	toast.textContent = message;
	toast.classList.add("visible");
	clearTimeout(toastTimer);
	toastTimer = setTimeout(() => toast.classList.remove("visible"), durationMs);
}

// ---------------------------------------------------------------------------
// Collapsible panels
// ---------------------------------------------------------------------------
function togglePanel(
	toggle: HTMLButtonElement,
	panel: HTMLElement,
	open?: boolean,
): void {
	const expanded =
		open !== undefined ? open : toggle.getAttribute("aria-expanded") !== "true";
	toggle.setAttribute("aria-expanded", String(expanded));
	panel.classList.toggle("open", expanded);
}

// ---------------------------------------------------------------------------
// Generate
// ---------------------------------------------------------------------------
function generatePassword(): void {
	const mode = optMode.value as GenerationMode;
	const language = optLanguage.value as Language;

	const result = generate({
		mode,
		language,
		symbols: Number(optSymbols.value),
		numbers: Number(optNumbers.value),
		uppercase: Number(optUppercase.value),
		wordCount: Number(optWordcount.value),
		excludeAmbiguous: optAmbiguous.checked,
	});

	passwordInput.value = result.password;

	if (result.original) {
		originalLabel.textContent = result.original;
		originalLabel.style.display = "block";
	} else {
		originalLabel.style.display = "none";
	}

	// Update strength indicator
	strengthFill.setAttribute("data-level", result.strength);
	strengthText.textContent = strengthLabel(result.strength);
	strengthEntropy.textContent = `${result.entropy} bits`;

	// Animate the button briefly
	btnGenerate.style.transform = "scale(0.97)";
	setTimeout(() => (btnGenerate.style.transform = ""), 120);

	pushHistory(result);
}

// ---------------------------------------------------------------------------
// Copy
// ---------------------------------------------------------------------------
async function copyToClipboard(text: string): Promise<void> {
	try {
		await navigator.clipboard.writeText(text);
		showToast(t("copied"));
	} catch {
		const ta = document.createElement("textarea");
		ta.value = text;
		ta.style.position = "fixed";
		ta.style.opacity = "0";
		document.body.appendChild(ta);
		ta.select();
		document.execCommand("copy");
		ta.remove();
		showToast(t("copied"));
	}
}

async function copyPassword(): Promise<void> {
	if (!passwordInput.value) return;
	await copyToClipboard(passwordInput.value);
	btnCopy.textContent = "✅";
	btnCopy.classList.add("copied");
	setTimeout(() => {
		btnCopy.textContent = "📋";
		btnCopy.classList.remove("copied");
	}, 1500);
}

// ---------------------------------------------------------------------------
// Preferences (localStorage for demo)
// ---------------------------------------------------------------------------
interface Preferences {
	mode: string;
	language: string;
	symbols: number;
	numbers: number;
	uppercase: number;
	wordCount: number;
	excludeAmbiguous: boolean;
}

function gatherPreferences(): Preferences {
	return {
		mode: optMode.value,
		language: optLanguage.value,
		symbols: Number(optSymbols.value),
		numbers: Number(optNumbers.value),
		uppercase: Number(optUppercase.value),
		wordCount: Number(optWordcount.value),
		excludeAmbiguous: optAmbiguous.checked,
	};
}

function applyPreferences(p: Partial<Preferences>): void {
	if (p.mode) optMode.value = p.mode;
	if (p.language) optLanguage.value = p.language;
	if (p.symbols !== undefined) optSymbols.value = String(p.symbols);
	if (p.numbers !== undefined) optNumbers.value = String(p.numbers);
	if (p.uppercase !== undefined) optUppercase.value = String(p.uppercase);
	if (p.wordCount !== undefined) optWordcount.value = String(p.wordCount);
	if (p.excludeAmbiguous !== undefined)
		optAmbiguous.checked = p.excludeAmbiguous;
}

function savePreferences(): void {
	localStorage.setItem("mp-preferences", JSON.stringify(gatherPreferences()));
}

function loadPreferences(): void {
	try {
		const stored = localStorage.getItem("mp-preferences");
		if (stored) applyPreferences(JSON.parse(stored));
	} catch {
		/* defaults */
	}
}

// ---------------------------------------------------------------------------
// Event listeners
// ---------------------------------------------------------------------------
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
	applyI18n(optLanguage.value as UILanguage);
	generatePassword();
	savePreferences();
});

for (const el of [optSymbols, optNumbers, optUppercase, optWordcount]) {
	el.addEventListener("change", () => {
		generatePassword();
		savePreferences();
	});
}
optAmbiguous.addEventListener("change", () => {
	generatePassword();
	savePreferences();
});

advancedToggle.addEventListener("click", () =>
	togglePanel(advancedToggle, advancedPanel),
);
historyToggle.addEventListener("click", () =>
	togglePanel(historyToggle, historyList),
);

document.addEventListener("keydown", (e) => {
	if (e.key === "Enter" && !e.metaKey && !e.ctrlKey) {
		e.preventDefault();
		generatePassword();
		savePreferences();
	}
});

// ---------------------------------------------------------------------------
// Initialize
// ---------------------------------------------------------------------------
loadPreferences();
applyI18n(optLanguage.value as UILanguage);
generatePassword();
