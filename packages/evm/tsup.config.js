import { createTsUpOptions } from '@tevm/tsupconfig'
import { copyFileSync, mkdirSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))

const baseOptions = createTsUpOptions({
	clean: true,
	entry: ['./src/index.ts'],
})

export default {
	...baseOptions,
	onSuccess: async () => {
		// Copy the WASM file to dist
		const wasmSrc = resolve(__dirname, 'src/guillotine_mini.wasm')
		const wasmDest = resolve(__dirname, 'dist/guillotine_mini.wasm')
		try {
			mkdirSync(resolve(__dirname, 'dist'), { recursive: true })
			copyFileSync(wasmSrc, wasmDest)
			console.log('Copied guillotine_mini.wasm to dist/')
		} catch (e) {
			console.warn('Warning: Could not copy guillotine_mini.wasm:', e.message)
		}
	},
}
