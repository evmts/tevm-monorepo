import { defineConfig } from 'tsup'

export default defineConfig({
	name: '@evmts/rollup',
	entry: ['src/index.ts'],
	outDir: 'dist',
	format: ['esm'],
	splitting: false,
	sourcemap: true,
	clean: true,
})
