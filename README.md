# Memorable Passwords

Generate memorable, secure passwords from real words. Easy to remember, hard to crack.

`determination` → `determ1n@tIon` · `Bosque-Cam1no-Estrella` · `k#Pm9xR!2vNq`

[Firefox Add-on](https://addons.mozilla.org/addon/memorable-passwords/)

---

## Features

- **3 generation modes** — Word transform, Passphrase, and fully Random
- **Bilingual dictionaries** — 1 800+ English words, 1 650+ Spanish words (6–12 chars, curated)
- **Configurable transforms** — control symbol, number & uppercase substitution counts
- **Strength meter** — real-time entropy estimation with visual feedback
- **i18n** — full UI translation (EN / ES) driven by language selection
- **Dark mode** — automatic, follows system preference
- **Session history** — last 25 passwords with individual copy
- **Cross-browser** — single Manifest v3 extension for Chrome, Edge & Firefox
- **Crypto-secure** — uses `crypto.getRandomValues()` for all randomness

---

## Architecture

Monorepo powered by **pnpm workspaces**, **TypeScript**, **Vite** and **Vitest**.

```
memorable-passwords/
├── packages/
│   ├── core/                  ← @memorable-passwords/core (library)
│   │   ├── src/
│   │   │   ├── types.ts           # GeneratorOptions, GeneratedPassword, defaults
│   │   │   ├── random.ts          # Crypto-secure random utilities
│   │   │   ├── transforms.ts      # removeDiacritics, applySymbols/Numbers/Uppercase
│   │   │   ├── strength.ts        # Entropy estimation & strength levels
│   │   │   ├── generator.ts       # generate() — main entry point
│   │   │   ├── index.ts           # Public API re-exports
│   │   │   └── dictionaries/
│   │   │       ├── en.ts          # 1 807 English words
│   │   │       └── es.ts          # 1 656 Spanish words
│   │   └── __tests__/             # 30 tests (generator, transforms, random)
│   │
│   └── extension/             ← Browser extension (Manifest v3)
│       ├── manifest.json          # Chrome / Edge / Firefox
│       ├── icons/icon.svg         # Master SVG icon
│       ├── public/icons/          # Generated PNGs (16, 48, 128)
│       └── src/
│           ├── background.ts      # Service worker
│           └── popup/
│               ├── popup.html     # Extension popup UI
│               ├── popup.css      # Design system + dark mode
│               ├── popup.ts       # UI logic, preferences, history
│               └── i18n.ts        # Lightweight i18n (EN / ES)
│
├── demo/                      ← Standalone visual demo (Vite)
│   ├── popup.html
│   └── demo.ts
│
├── scripts/
│   └── generate-icons.mjs     # SVG → PNG via sharp
│
├── legacy/                    ← v1 code (archived)
├── .github/workflows/ci.yml  # GitHub Actions (lint → test → build)
└── PLAN.md                    # v2 roadmap
```

---

## Quick start

### Prerequisites

- **Node.js** ≥ 20
- **pnpm** ≥ 10

### Install & build

```bash
pnpm install
pnpm build        # builds core + extension
```

### Development

```bash
pnpm demo          # visual demo at http://localhost:3000
pnpm dev           # extension dev mode (hot reload)
pnpm test          # run all 30 tests
pnpm test:watch    # watch mode
pnpm lint          # TypeScript type-check
```

### Load extension in browser

1. `pnpm build`
2. Load `packages/extension/dist/` as an unpacked extension:
   - **Chrome:** `chrome://extensions` → Developer mode → Load unpacked
   - **Edge:** `edge://extensions` → Developer mode → Load unpacked
   - **Firefox:** `about:debugging` → This Firefox → Load Temporary Add-on → select `manifest.json`

---

## Core API

The `@memorable-passwords/core` package exports a single `generate()` function:

```ts
import { generate } from "@memorable-passwords/core";

// Word mode (default)
const result = generate();
// → { password: "determ1n@tIon", original: "determination", entropy: 42, strength: "strong", mode: "word" }

// Passphrase mode
const result = generate({ mode: "passphrase", language: "es", wordCount: 3 });
// → { password: "Bosque-Cam1no-Estrella", original: "Bosque-Camino-Estrella", ... }

// Random mode
const result = generate({ mode: "random", length: { min: 16, max: 20 } });
// → { password: "k#Pm9xR!2vNq8bWs", original: "", ... }
```

### Options

| Option             | Type                                 | Default     | Description                                          |
| ------------------ | ------------------------------------ | ----------- | ---------------------------------------------------- |
| `mode`             | `"word" \| "passphrase" \| "random"` | `"word"`    | Generation strategy                                  |
| `language`         | `"en" \| "es"`                       | `"en"`      | Dictionary language                                  |
| `symbols`          | `number`                             | `1`         | Number of symbol substitutions                       |
| `numbers`          | `number`                             | `1`         | Number of number substitutions                       |
| `uppercase`        | `number`                             | `1`         | Number of uppercase transforms                       |
| `wordCount`        | `number`                             | `3`         | Words in passphrase mode                             |
| `separator`        | `string`                             | `"-"`       | Passphrase word separator                            |
| `length`           | `{ min, max }`                       | `{ 8, 15 }` | Length range (filter in word mode, target in random) |
| `excludeAmbiguous` | `boolean`                            | `false`     | Exclude 0/O, 1/l/I                                   |

### Return value

```ts
interface GeneratedPassword {
	password: string; // The generated password
	original: string; // Source word(s), empty for random mode
	entropy: number; // Estimated entropy in bits
	strength: StrengthLevel; // "weak" | "fair" | "strong" | "very-strong"
	mode: GenerationMode;
}
```

---

## Scripts

| Command                | Description                        |
| ---------------------- | ---------------------------------- |
| `pnpm build`           | Build all packages                 |
| `pnpm build:core`      | Build core library only            |
| `pnpm build:extension` | Build extension only               |
| `pnpm dev`             | Extension dev mode with hot reload |
| `pnpm demo`            | Launch visual demo (Vite)          |
| `pnpm test`            | Run all tests (Vitest)             |
| `pnpm lint`            | TypeScript type-check (`tsc -b`)   |
| `pnpm icons`           | Regenerate PNG icons from SVG      |

---

## Tech stack

| Technology      | Purpose                                        |
| --------------- | ---------------------------------------------- |
| TypeScript 5.9  | Type-safe source code                          |
| Vite 7          | Bundling (library mode + web extension plugin) |
| Vitest 4        | Unit testing (30 tests)                        |
| pnpm workspaces | Monorepo management                            |
| Manifest v3     | Cross-browser extension standard               |
| sharp           | SVG → PNG icon generation                      |
| GitHub Actions  | CI (lint → test → build, Node 20 + 22)         |

---

## License

[GNU General Public License v3](LICENSE)
