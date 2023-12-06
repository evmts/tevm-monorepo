import { defineConfig } from 'tsup'

export default defineConfig({
	name: '@tevm/rspack-plugin',
	entry: ['src/index.js'],
	outDir: 'dist',
	format: ['cjs'],
	splitting: false,
	sourcemap: true,
	clean: true,
	skipNodeModulesBundle: true,
})
