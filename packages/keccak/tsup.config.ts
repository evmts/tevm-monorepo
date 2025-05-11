import { createTsUpOptions } from '@tevm/tsupconfig'

export default createTsUpOptions({
	entry: ['./src/index.ts'],
	// Add the wasm file to the assets so it's included in the build
	assets: [
		{
			from: '../dist/keccak.wasm',
			to: 'keccak.wasm',
		},
	],
})