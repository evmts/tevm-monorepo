import { defineConfig } from 'tsup'

export default defineConfig({
	entry: ['src/index.js'],
	format: ['esm', 'cjs'],
	dts: true,
	sourcemap: true,
	clean: true,
	treeshake: true,
	splitting: false,
})
