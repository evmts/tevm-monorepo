import { instantiateNapiModuleSync, MessageHandler, WASI } from '@napi-rs/wasm-runtime'

const handler = new MessageHandler({
	onLoad({ wasmModule, wasmMemory }) {
		const wasi = new WASI({
			print: (...args) => {
				// eslint-disable-next-line no-console
				console.log(...args)
			},
			printErr: (...args) => {
				// eslint-disable-next-line no-console
				console.error(...args)
			},
		})
		return instantiateNapiModuleSync(wasmModule, {
			childThread: true,
			wasi,
			overwriteImports(importObject) {
				importObject.env = {
					...importObject.env,
					...importObject.napi,
					...importObject.emnapi,
					memory: wasmMemory,
				}
			},
		})
	},
})

globalThis.onmessage = (e) => {
	handler.handle(e)
}
