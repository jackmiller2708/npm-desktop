/// <reference types="vitest" />
import { fileURLToPath, URL } from "node:url";
import { defineConfig } from "vitest/config";

export default defineConfig({
	test: {
		globals: true,
		environment: "node",
		coverage: {
			provider: "v8",
			reporter: ["text", "html", 'lcov'],
			include: ["src/infrastructure/**"],
			exclude: [
				"**/__tests__/**",
				"dist/**",
				"node_modules/**",
				"electron/**/preload.ts",
				"**/index.ts",
				"**/*.{runtime,startup}.ts",
				"**/preload.ts",
				"**/main.ts",
				"**/*.mock.ts",
				"src/infrastructure/**/windows/*"
			],
		},
	},
	resolve: {
		alias: {
			"@shared": fileURLToPath(new URL("./src/shared", import.meta.url)),
			"@application": fileURLToPath(new URL("./src/application", import.meta.url)),
			"@core": fileURLToPath(new URL("./src/core", import.meta.url)),
		},
	},
});
