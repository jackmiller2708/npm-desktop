import { fileURLToPath, URL } from "node:url";

import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";

import { defineConfig } from "vite";

// https://vitejs.dev/config
export default defineConfig({
	plugins: [react(), tailwindcss()],
	resolve: {
		alias: {
			"@shared": fileURLToPath(new URL("./src/shared", import.meta.url)),
			"@presentation": fileURLToPath(new URL("./src/presentation", import.meta.url)),
		},
	},
});
