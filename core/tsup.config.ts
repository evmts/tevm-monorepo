import { defineConfig } from 'tsup'

export default defineConfig({
	name: '@evmts/core',
	entry: ['src/index.ts', 'src/bin/cli.ts'],
	outDir: 'dist',
	format: ['esm', 'cjs'],
	splitting: false,
	sourcemap: true,
	external: ['esbuild'],
	clean: true,
})
