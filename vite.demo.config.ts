import { defineConfig } from "vite";

export default defineConfig({
	root: "demo",
	server: {
		port: 3000,
		open: "/popup.html",
		fs: {
			allow: [".."],
		},
	},
});
