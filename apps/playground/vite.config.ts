import { envTsPluginRollup } from "@evmts/plugin-rollup";
import { vanillaExtractPlugin } from "@vanilla-extract/vite-plugin";
import react from "@vitejs/plugin-react";
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
    react({ babel: { configFile: "./babel.config.js" } }),
    vanillaExtractPlugin(),
    envTsPluginRollup({
      forgeExecutable: "forge",
      projectRoot: __dirname,
    }),
  ],
});
