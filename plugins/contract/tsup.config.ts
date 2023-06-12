import { defineConfig } from 'tsup'

export default defineConfig({
	name: '@evmts/contract-import',
	entry: ['src/index.ts'],
	outDir: 'dist',
	format: ['esm', 'cjs'],
	splitting: false,
	sourcemap: true,
	clean: true,
})
