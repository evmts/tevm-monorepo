import { createTsUpOptions } from '@tevm/tsupconfig'
import { defineConfig } from 'tsup'

export default defineConfig({
	...createTsUpOptions({
		entry: ['src/index.ts'],
		target: 'js',
	}),
	tsconfig: './tsconfig.build.json',
})
