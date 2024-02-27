import { js } from '@tevm/tsupconfig'
import { defineConfig } from 'tsup'
export default defineConfig({
	...js,
	entry: ['src/index.ts'],
})
