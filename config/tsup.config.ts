import { defineConfig } from 'tsup'

export default defineConfig({
	name: '@evmts/core',
	entry: ['src/index.js'],
	outDir: 'dist',
	format: ['cjs'],
	splitting: false,
	sourcemap: true,
	clean: true,
})
