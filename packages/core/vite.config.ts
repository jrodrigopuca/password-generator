import { defineConfig } from "vite";
import { resolve } from "path";
import dts from "vite-plugin-dts";

export default defineConfig({
	plugins: [
		dts({
			rollupTypes: true,
			tsconfigPath: "./tsconfig.json",
		}),
	],
	build: {
		lib: {
			entry: resolve(__dirname, "src/index.ts"),
			name: "MemorablePasswords",
			formats: ["es", "cjs"],
			fileName: (format) => `index.${format === "es" ? "js" : "cjs"}`,
		},
		outDir: "dist",
		sourcemap: true,
	},
});
