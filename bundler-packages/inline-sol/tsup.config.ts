import { createTsUpOptions } from '@tevm/tsupconfig'

export default createTsUpOptions({
	entry: ['src/index.js'],
	format: ['cjs', 'esm'],
	dts: true,
})
