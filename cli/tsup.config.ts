import { createTsUpOptions } from '@tevm/tsupconfig'
import { defineConfig } from 'tsup'
const base = createTsUpOptions({
	entry: ['src/index.ts', 'src/tevm-cli.tsx'],
	target: 'node',
})

export default defineConfig({
	...base,
	bundle: false,
})
