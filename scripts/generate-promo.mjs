#!/usr/bin/env node
/**
 * Generate the 1400×560 promotional banner for browser extension stores.
 *
 * Usage: node scripts/generate-promo.mjs
 * Output: packages/extension/promo-1400x560.png
 */

import { writeFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");
const OUT = resolve(ROOT, "packages/extension/promo-1400x560.png");

const W = 1400;
const H = 560;

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#9c5fff"/>
      <stop offset="40%" stop-color="#7c4dff"/>
      <stop offset="100%" stop-color="#512da8"/>
    </linearGradient>
    <radialGradient id="glow" cx="30%" cy="40%" r="60%">
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
    <filter id="iconShadow" x="-10%" y="-10%" width="140%" height="140%">
      <feDropShadow dx="0" dy="4" stdDeviation="8" flood-color="#000" flood-opacity="0.3"/>
    </filter>
  </defs>

  <!-- Background -->
  <rect width="${W}" height="${H}" fill="url(#bg)"/>
  <rect width="${W}" height="${H}" fill="url(#glow)"/>

  <!-- Decorative circles -->
  <circle cx="1250" cy="100" r="200" fill="#fff" opacity="0.03"/>
  <circle cx="1350" cy="450" r="150" fill="#fff" opacity="0.025"/>
  <circle cx="100" cy="500" r="180" fill="#fff" opacity="0.02"/>

  <!-- ===== LEFT: Icon ===== -->
  <g transform="translate(120, 140)" filter="url(#iconShadow)">
    <rect x="0" y="0" width="280" height="280" rx="62" ry="62" fill="url(#bg)" stroke="#fff" stroke-width="2" stroke-opacity="0.2"/>
    <rect x="0" y="0" width="280" height="280" rx="62" ry="62" fill="url(#glow)"/>
    <g transform="translate(140, 128)">
      <circle cx="-24" cy="0" r="42" fill="none" stroke="url(#keyFill)" stroke-width="11" stroke-linecap="round"/>
      <rect x="18" y="-7" width="88" height="14" rx="7" fill="url(#keyFill)"/>
      <rect x="78" y="-7" width="10" height="28" rx="5" fill="url(#keyFill)"/>
      <rect x="58" y="-7" width="10" height="22" rx="5" fill="url(#keyFill)"/>
    </g>
    <g fill="url(#gold)">
      <path d="M220,52 L224,40 L228,52 L240,56 L228,60 L224,72 L220,60 L208,56 Z" opacity="0.9"/>
      <path d="M48,200 L51,192 L54,200 L62,203 L54,206 L51,214 L48,206 L40,203 Z" opacity="0.7"/>
      <circle cx="60" cy="65" r="4" opacity="0.6"/>
    </g>
  </g>

  <!-- ===== RIGHT: Title ===== -->
  <text x="500" y="195" font-family="Helvetica, Arial, sans-serif" font-size="72" font-weight="bold" fill="#fff" letter-spacing="-1">
    Memorable Passwords
  </text>
  <text x="500" y="260" font-family="Helvetica, Arial, sans-serif" font-size="30" fill="#fff" opacity="0.85">
    Strong passwords you can actually remember.
  </text>

  <!-- ===== Password examples ===== -->
  <!-- Word -->
  <rect x="500" y="310" width="370" height="52" rx="26" fill="#fff" opacity="0.12"/>
  <text x="526" y="343" font-family="Courier, monospace" font-size="22" fill="#ffe082" font-weight="bold">determ1n@tIon</text>
  <rect x="745" y="325" width="70" height="24" rx="12" fill="#fff" opacity="0.1"/>
  <text x="761" y="342" font-family="Helvetica, Arial, sans-serif" font-size="13" fill="#fff" opacity="0.6">Word</text>

  <!-- Passphrase -->
  <rect x="500" y="376" width="460" height="52" rx="26" fill="#fff" opacity="0.12"/>
  <text x="526" y="409" font-family="Courier, monospace" font-size="22" fill="#ffe082" font-weight="bold">Bosque-Cam1no-Estrella</text>
  <rect x="822" y="391" width="104" height="24" rx="12" fill="#fff" opacity="0.1"/>
  <text x="834" y="408" font-family="Helvetica, Arial, sans-serif" font-size="13" fill="#fff" opacity="0.6">Passphrase</text>

  <!-- Random -->
  <rect x="500" y="442" width="340" height="52" rx="26" fill="#fff" opacity="0.12"/>
  <text x="526" y="475" font-family="Courier, monospace" font-size="22" fill="#ffe082" font-weight="bold">k#Pm9xR!2vNq</text>
  <rect x="718" y="457" width="84" height="24" rx="12" fill="#fff" opacity="0.1"/>
  <text x="730" y="474" font-family="Helvetica, Arial, sans-serif" font-size="13" fill="#fff" opacity="0.6">Random</text>

  <!-- ===== Feature badges ===== -->
  <rect x="1020" y="310" width="120" height="38" rx="19" fill="#fff" opacity="0.1"/>
  <text x="1046" y="335" font-family="Helvetica, Arial, sans-serif" font-size="15" fill="#fff" opacity="0.9">Secure</text>

  <rect x="1158" y="310" width="120" height="38" rx="19" fill="#fff" opacity="0.1"/>
  <text x="1184" y="335" font-family="Helvetica, Arial, sans-serif" font-size="15" fill="#fff" opacity="0.9">EN / ES</text>

  <rect x="1020" y="362" width="140" height="38" rx="19" fill="#fff" opacity="0.1"/>
  <text x="1046" y="387" font-family="Helvetica, Arial, sans-serif" font-size="15" fill="#fff" opacity="0.9">Dark mode</text>

  <rect x="1178" y="362" width="140" height="38" rx="19" fill="#fff" opacity="0.1"/>
  <text x="1204" y="387" font-family="Helvetica, Arial, sans-serif" font-size="15" fill="#fff" opacity="0.9">One-click</text>

  <rect x="1020" y="414" width="120" height="38" rx="19" fill="#fff" opacity="0.1"/>
  <text x="1046" y="439" font-family="Helvetica, Arial, sans-serif" font-size="15" fill="#fff" opacity="0.9">History</text>

  <rect x="1158" y="414" width="120" height="38" rx="19" fill="#fff" opacity="0.1"/>
  <text x="1184" y="439" font-family="Helvetica, Arial, sans-serif" font-size="15" fill="#fff" opacity="0.9">Private</text>

  <!-- Small lock icon in Secure badge (SVG shape, no emoji) -->
  <g transform="translate(1030, 322)" fill="#ffe082" opacity="0.9">
    <rect x="2" y="6" width="10" height="8" rx="1.5"/>
    <path d="M4,6 V4 a3,3 0 0 1 6,0 V6" fill="none" stroke="#ffe082" stroke-width="1.5"/>
  </g>

  <!-- Small globe icon in EN/ES badge -->
  <circle cx="1171" cy="329" r="6" fill="none" stroke="#ffe082" stroke-width="1.2" opacity="0.9"/>
  <line x1="1165" y1="329" x2="1177" y2="329" stroke="#ffe082" stroke-width="0.8" opacity="0.9"/>
  <ellipse cx="1171" cy="329" rx="3" ry="6" fill="none" stroke="#ffe082" stroke-width="0.8" opacity="0.9"/>
</svg>`;

async function main() {
	const sharp = (await import("sharp")).default;

	const png = await sharp(Buffer.from(svg), { density: 150 })
		.resize(W, H)
		.png({ quality: 95, compressionLevel: 9 })
		.toBuffer();

	writeFileSync(OUT, png);

	console.log(
		`✅ Promo image generated: ${OUT} (${(png.length / 1024).toFixed(1)} KB)`,
	);
}

main().catch((err) => {
	console.error("Error generating promo image:", err);
	process.exit(1);
});
