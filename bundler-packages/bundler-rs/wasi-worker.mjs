import { dirname, join } from 'node:path'
// Worker implementation for WASI
import process from 'node:process'
import { fileURLToPath } from 'node:url'
import { Worker } from 'node:worker_threads'

const __dirname = dirname(fileURLToPath(import.meta.url))

const wasmModule = join(__dirname, './tevm_bundler_rs.wasm')
const wasiWorker = new Worker(join(__dirname, './tevm_bundler_rs.wasi.cjs'), {
	env: {
		...process.env,
		NODE_WASI_MODULE: wasmModule,
	},
})

export default wasiWorker
