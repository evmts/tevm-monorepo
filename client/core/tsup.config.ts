import { defineConfig } from 'tsup'

export default defineConfig({
	name: '@evmts/core',
	entry: [
		'src/index.ts',
		'src/actions/index.ts',
		'src/types/index.ts',
		'src/utils/index.ts',
	],
	outDir: 'dist',
	format: ['esm', 'cjs'],
	splitting: false,
	sourcemap: true,
	clean: true,
})
