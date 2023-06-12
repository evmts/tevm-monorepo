import { defineConfig } from 'tsup'

export default defineConfig({
	name: '@evmts/vite',
	entry: ['src/index.ts'],
	outDir: 'dist',
	format: ['esm', 'cjs'],
	splitting: false,
	sourcemap: true,
	clean: true,
})
