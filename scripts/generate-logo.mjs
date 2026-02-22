#!/usr/bin/env node
/**
 * Generate a 300×300 logo PNG for store publishing.
 *
 * Usage: node scripts/generate-logo.mjs
 * Output: packages/extension/logo-300x300.png
 */

import { readFileSync, writeFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");
const SVG_PATH = resolve(ROOT, "packages/extension/icons/icon.svg");
const OUT = resolve(ROOT, "packages/extension/logo-300x300.png");

async function main() {
	const sharp = (await import("sharp")).default;
	const svg = readFileSync(SVG_PATH, "utf-8");

	const png = await sharp(Buffer.from(svg), { density: 300 })
		.resize(300, 300, {
			fit: "contain",
			background: { r: 0, g: 0, b: 0, alpha: 0 },
		})
		.png({ quality: 100, compressionLevel: 9 })
		.toBuffer();

	writeFileSync(OUT, png);
	console.log(`Logo generated: ${OUT} (${(png.length / 1024).toFixed(1)} KB)`);
}

main().catch((err) => {
	console.error("Error generating logo:", err);
	process.exit(1);
});
