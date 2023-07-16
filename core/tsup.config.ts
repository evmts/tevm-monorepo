import { defineConfig } from 'tsup'

export default defineConfig({
	name: '@evmts/core',
	entry: ['src/index.ts'],
	outDir: 'dist',
	format: ['esm', 'cjs'],
	splitting: false,
	noExternal: ['abitype'],
	bundle: true,
	sourcemap: true,
	clean: true,
})
