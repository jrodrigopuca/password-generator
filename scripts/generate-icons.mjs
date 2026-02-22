#!/usr/bin/env node
/**
 * Generate PNG icons from SVG source for the browser extension.
 * Uses sharp for high-quality rendering.
 *
 * Usage: node scripts/generate-icons.mjs
 */

import { readFileSync, writeFileSync, mkdirSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");
const ICONS_DIR = resolve(ROOT, "packages/extension/icons");
const PUBLIC_ICONS_DIR = resolve(ROOT, "packages/extension/public/icons");

// Sizes needed for browser extension manifest v3 + store publishing
const SIZES = [16, 48, 64, 128];

// The main SVG — used for 48px and 128px
const mainSvg = readFileSync(resolve(ICONS_DIR, "icon.svg"), "utf-8");

// Simplified SVG for 16px — bolder strokes, no sparkles, simpler key
const svg16 = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="16" height="16">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#9c5fff"/>
      <stop offset="100%" stop-color="#512da8"/>
    </linearGradient>
  </defs>
  <rect x="0.5" y="0.5" width="15" height="15" rx="3.5" fill="url(#bg)"/>
  <g transform="translate(8, 8.5)">
    <circle cx="-2" cy="0" r="3" fill="none" stroke="#fff" stroke-width="1.5"/>
    <rect x="1" y="-0.75" width="5" height="1.5" rx="0.75" fill="#fff"/>
    <rect x="4" y="-0.75" width="1.2" height="3" rx="0.6" fill="#fff"/>
  </g>
</svg>`;

async function main() {
	const sharp = (await import("sharp")).default;

	mkdirSync(ICONS_DIR, { recursive: true });
	mkdirSync(PUBLIC_ICONS_DIR, { recursive: true });

	for (const size of SIZES) {
		const svgSource = size <= 16 ? svg16 : mainSvg;
		const density = size <= 48 ? 300 : 150; // Higher density for small icons

		const png = await sharp(Buffer.from(svgSource), { density })
			.resize(size, size, {
				fit: "contain",
				background: { r: 0, g: 0, b: 0, alpha: 0 },
			})
			.png({ quality: 100, compressionLevel: 9 })
			.toBuffer();

		const outPath = resolve(PUBLIC_ICONS_DIR, `icon-${size}.png`);
		writeFileSync(outPath, png);
		console.log(
			`✓ Generated ${outPath} (${size}x${size}, ${png.length} bytes)`,
		);
	}

	console.log("\nDone! All icons generated.");
}

main().catch((err) => {
	console.error("Error generating icons:", err);
	process.exit(1);
});
