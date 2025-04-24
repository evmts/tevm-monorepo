import { defineConfig } from 'tsup'

export default defineConfig({
	entry: ['src/index.ts'],
	format: ['cjs', 'esm'],
	target: 'es2020',
	dts: true,
	sourcemap: true,
	clean: true,
	bundle: true,
	treeshake: true,
	esbuildOptions(options) {
		options.external = [
			// Add external dependencies that shouldn't be bundled
			'@tevm/errors',
		]

		// Make sure we properly handle WASM imports
		options.loader = {
			...options.loader,
			'.wasm': 'file',
		}
	},
})
