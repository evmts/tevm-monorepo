import { defineConfig } from 'tsup'

export default defineConfig({
	name: '@evmts/rspack-plugin',
	entry: ['src/index.js'],
	outDir: 'dist',
	format: ['cjs'],
	splitting: false,
	sourcemap: true,
	clean: true,
	skipNodeModulesBundle: true,
})
