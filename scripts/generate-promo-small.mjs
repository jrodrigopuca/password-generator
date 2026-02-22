#!/usr/bin/env node
/**
 * Generate the 440×280 promotional tile for browser extension stores.
 *
 * Usage: node scripts/generate-promo-small.mjs
 * Output: packages/extension/promo-440x280.png
 */

import { writeFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");
const OUT = resolve(ROOT, "packages/extension/promo-440x280.png");

const W = 440;
const H = 280;

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#9c5fff"/>
      <stop offset="40%" stop-color="#7c4dff"/>
      <stop offset="100%" stop-color="#512da8"/>
    </linearGradient>
    <radialGradient id="glow" cx="35%" cy="35%" r="65%">
      <stop offset="0%" stop-color="#fff" stop-opacity="0.08"/>
      <stop offset="100%" stop-color="#fff" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="keyFill" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#ffffff"/>
      <stop offset="100%" stop-color="#e8daf7"/>
    </linearGradient>
    <linearGradient id="gold" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#ffe082"/>
      <stop offset="100%" stop-color="#ffb300"/>
    </linearGradient>
    <filter id="iconShadow" x="-20%" y="-20%" width="160%" height="160%">
      <feDropShadow dx="0" dy="2" stdDeviation="4" flood-color="#000" flood-opacity="0.25"/>
    </filter>
  </defs>

  <!-- Background -->
  <rect width="${W}" height="${H}" fill="url(#bg)"/>
  <rect width="${W}" height="${H}" fill="url(#glow)"/>

  <!-- Decorative circles -->
  <circle cx="400" cy="40" r="80" fill="#fff" opacity="0.03"/>
  <circle cx="30" cy="260" r="70" fill="#fff" opacity="0.025"/>

  <!-- ===== Key icon (centered top) ===== -->
  <g transform="translate(220, 48)" filter="url(#iconShadow)">
    <g transform="translate(0, 0)">
      <circle cx="-16" cy="0" r="26" fill="none" stroke="url(#keyFill)" stroke-width="7" stroke-linecap="round"/>
      <rect x="10" y="-4.5" width="56" height="9" rx="4.5" fill="url(#keyFill)"/>
      <rect x="48" y="-4.5" width="7" height="18" rx="3.5" fill="url(#keyFill)"/>
      <rect x="36" y="-4.5" width="7" height="14" rx="3.5" fill="url(#keyFill)"/>
    </g>
    <!-- Sparkles -->
    <g fill="url(#gold)">
      <path d="M52,-24 L54.5,-30 L57,-24 L63,-21.5 L57,-19 L54.5,-13 L52,-19 L46,-21.5 Z" opacity="0.85"/>
      <circle cx="-40" cy="22" r="2.5" opacity="0.55"/>
    </g>
  </g>

  <!-- ===== Title ===== -->
  <text x="220" y="120" text-anchor="middle" font-family="Helvetica, Arial, sans-serif" font-size="30" font-weight="bold" fill="#fff" letter-spacing="-0.5">
    Memorable Passwords
  </text>
  <text x="220" y="148" text-anchor="middle" font-family="Helvetica, Arial, sans-serif" font-size="14" fill="#fff" opacity="0.8">
    Strong passwords you can actually remember.
  </text>

  <!-- ===== Password examples ===== -->
  <!-- Word -->
  <rect x="50" y="170" width="175" height="36" rx="18" fill="#fff" opacity="0.12"/>
  <text x="68" y="194" font-family="Courier, monospace" font-size="15" fill="#ffe082" font-weight="bold">determ1n@tIon</text>

  <!-- Passphrase -->
  <rect x="238" y="170" width="172" height="36" rx="18" fill="#fff" opacity="0.12"/>
  <text x="252" y="194" font-family="Courier, monospace" font-size="13" fill="#ffe082" font-weight="bold">Bosque-Cam1no</text>

  <!-- ===== Feature pills ===== -->
  <rect x="72" y="222" width="88" height="28" rx="14" fill="#fff" opacity="0.1"/>
  <text x="116" y="241" font-family="Helvetica, Arial, sans-serif" font-size="12" fill="#fff" opacity="0.85" text-anchor="middle">Secure</text>

  <rect x="174" y="222" width="92" height="28" rx="14" fill="#fff" opacity="0.1"/>
  <text x="220" y="241" font-family="Helvetica, Arial, sans-serif" font-size="12" fill="#fff" opacity="0.85" text-anchor="middle">Dark mode</text>

  <rect x="280" y="222" width="88" height="28" rx="14" fill="#fff" opacity="0.1"/>
  <text x="324" y="241" font-family="Helvetica, Arial, sans-serif" font-size="12" fill="#fff" opacity="0.85" text-anchor="middle">EN / ES</text>
</svg>`;

async function main() {
	const sharp = (await import("sharp")).default;

	const png = await sharp(Buffer.from(svg), { density: 150 })
		.resize(W, H)
		.png({ quality: 95, compressionLevel: 9 })
		.toBuffer();

	writeFileSync(OUT, png);

	console.log(
		`Promo tile generated: ${OUT} (${(png.length / 1024).toFixed(1)} KB)`,
	);
}

main().catch((err) => {
	console.error("Error generating promo tile:", err);
	process.exit(1);
});
