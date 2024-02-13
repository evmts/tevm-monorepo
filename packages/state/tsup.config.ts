import { createTsUpOptions } from '@tevm/tsupconfig'
import { defineConfig } from 'tsup'
const baseOptions = createTsUpOptions({
	entry: ['./src/index.ts'],
})
export default defineConfig({
	...baseOptions,
	noExternal: ['debug', 'ms', ...(baseOptions?.noExternal ?? [])],
})
