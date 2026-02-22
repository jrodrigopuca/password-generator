#!/usr/bin/env node
/**
 * Generate the 300×188 promotional tile for browser extension stores.
 *
 * Usage: node scripts/generate-promo-marquee.mjs
 * Output: packages/extension/promo-300x188.png
 */

import { writeFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");
const OUT = resolve(ROOT, "packages/extension/promo-300x188.png");

const W = 300;
const H = 188;

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#9c5fff"/>
      <stop offset="40%" stop-color="#7c4dff"/>
      <stop offset="100%" stop-color="#512da8"/>
    </linearGradient>
    <radialGradient id="glow" cx="35%" cy="30%" r="65%">
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
      <feDropShadow dx="0" dy="1.5" stdDeviation="3" flood-color="#000" flood-opacity="0.2"/>
    </filter>
  </defs>

  <!-- Background -->
  <rect width="${W}" height="${H}" fill="url(#bg)"/>
  <rect width="${W}" height="${H}" fill="url(#glow)"/>

  <!-- Decorative circles -->
  <circle cx="270" cy="25" r="55" fill="#fff" opacity="0.03"/>
  <circle cx="20" cy="175" r="45" fill="#fff" opacity="0.025"/>

  <!-- ===== Key icon (centered top) ===== -->
  <g transform="translate(150, 38)" filter="url(#iconShadow)">
    <circle cx="-12" cy="0" r="19" fill="none" stroke="url(#keyFill)" stroke-width="5.5" stroke-linecap="round"/>
    <rect x="7" y="-3.5" width="42" height="7" rx="3.5" fill="url(#keyFill)"/>
    <rect x="36" y="-3.5" width="5.5" height="14" rx="2.5" fill="url(#keyFill)"/>
    <rect x="26" y="-3.5" width="5.5" height="11" rx="2.5" fill="url(#keyFill)"/>
    <!-- Sparkle -->
    <g fill="url(#gold)">
      <path d="M40,-18 L42,-23 L44,-18 L49,-16 L44,-14 L42,-9 L40,-14 L35,-16 Z" opacity="0.85"/>
      <circle cx="-30" cy="16" r="2" opacity="0.5"/>
    </g>
  </g>

  <!-- ===== Title ===== -->
  <text x="150" y="86" text-anchor="middle" font-family="Helvetica, Arial, sans-serif" font-size="22" font-weight="bold" fill="#fff" letter-spacing="-0.5">
    Memorable Passwords
  </text>
  <text x="150" y="104" text-anchor="middle" font-family="Helvetica, Arial, sans-serif" font-size="11" fill="#fff" opacity="0.8">
    Strong passwords you can actually remember.
  </text>

  <!-- ===== Password examples ===== -->
  <rect x="28" y="118" width="142" height="28" rx="14" fill="#fff" opacity="0.12"/>
  <text x="42" y="137" font-family="Courier, monospace" font-size="12" fill="#ffe082" font-weight="bold">determ1n@tIon</text>

  <rect x="180" y="118" width="92" height="28" rx="14" fill="#fff" opacity="0.12"/>
  <text x="192" y="137" font-family="Courier, monospace" font-size="11" fill="#ffe082" font-weight="bold">k#Pm9xR!</text>

  <!-- ===== Feature pills ===== -->
  <rect x="42" y="158" width="68" height="22" rx="11" fill="#fff" opacity="0.1"/>
  <text x="76" y="173" font-family="Helvetica, Arial, sans-serif" font-size="10" fill="#fff" opacity="0.85" text-anchor="middle">Secure</text>

  <rect x="120" y="158" width="68" height="22" rx="11" fill="#fff" opacity="0.1"/>
  <text x="154" y="173" font-family="Helvetica, Arial, sans-serif" font-size="10" fill="#fff" opacity="0.85" text-anchor="middle">EN / ES</text>

  <rect x="198" y="158" width="68" height="22" rx="11" fill="#fff" opacity="0.1"/>
  <text x="232" y="173" font-family="Helvetica, Arial, sans-serif" font-size="10" fill="#fff" opacity="0.85" text-anchor="middle">Private</text>
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
