import { createTsUpOptions } from '@tevm/tsupconfig'

export default createTsUpOptions({
	entry: ['src/index.js'],
	outDir: 'dist',
	platform: 'neutral',
	format: ['cjs', 'esm'],
	target: 'es2022',
	splitting: false,
	sourcemap: true,
	bundle: true,
	dts: true,
	treeshake: {
		preset: 'recommended',
	},
})
