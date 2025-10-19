import { fileURLToPath, URL } from "node:url";
import { defineConfig } from "vite";

// https://vitejs.dev/config
export default defineConfig({
	resolve: {
		alias: {
			"@shared": fileURLToPath(new URL("./src/shared", import.meta.url)),
			"@application": fileURLToPath(new URL("./src/application", import.meta.url)),
			"@core": fileURLToPath(new URL("./src/core", import.meta.url))
		},
	},
});
