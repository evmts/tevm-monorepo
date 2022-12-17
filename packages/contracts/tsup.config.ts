import { defineConfig } from 'tsup'

export default defineConfig({
  name: '@evmts/common-ts',
  entry: ['dist/generatedWagmi.ts'],
  outDir: 'dist',
  format: ['esm', 'cjs', 'iife'],
  splitting: false,
  sourcemap: true,
  clean: false,
})
