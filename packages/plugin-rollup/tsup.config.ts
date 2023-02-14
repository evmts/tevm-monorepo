import { defineConfig } from 'tsup'

export default defineConfig({
  name: '@evmts/plugin-rollup',
  entry: ['src/index.ts'],
  outDir: 'dist',
  format: ['esm', 'cjs', 'iife'],
  splitting: false,
  sourcemap: true,
  treeshake: true,
  clean: true,
})
