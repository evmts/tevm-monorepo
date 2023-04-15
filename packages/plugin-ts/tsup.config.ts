import { defineConfig } from "tsup";

export default defineConfig({
  name: "@evmts/plugin-ts",
  entry: ['src/index.ts'],
  outDir: "dist",
  format: ["esm", 'cjs'],
  splitting: true,
  dts: false,
  minify: false,
  sourcemap: true,
  clean: true,
});
