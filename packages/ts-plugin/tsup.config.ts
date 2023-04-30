import { defineConfig } from 'tsup'

export default defineConfig({
  name: '@evmts/ts-plugin',
  entry: ['src/index.ts'],
  outDir: 'dist',
  format: ['esm', 'cjs'],
  splitting: true,
  dts: false,
  minify: false,
  sourcemap: true,
  clean: true,
})
