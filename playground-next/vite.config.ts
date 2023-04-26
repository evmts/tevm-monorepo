import { foundry } from "@evmts/rollup-plugin";
import react from "@vitejs/plugin-react";
import { join } from "path";
import { defineConfig } from "vitest/config";

/**
 * @see https://vitejs.dev/config/
 */
export default defineConfig({
	build: {
		outDir: "dist",
		minify: false,
	},
	resolve: {},
	test: {
		environment: "jsdom",
	},
	plugins: [
		react(),
		foundry({
			forgeExecutable: "forge",
			project: join(__dirname, ".."),
		}),
	],
});
