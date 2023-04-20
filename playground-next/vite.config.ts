import { foundry } from "@evmts/plugin-rollup";
import react from "@vitejs/plugin-react";
import path = require("path");
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
			project: path.join(__dirname, '..'),
		}),
	],
});
