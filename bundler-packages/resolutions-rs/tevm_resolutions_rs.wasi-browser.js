import {
	WASI as __WASI,
	getDefaultContext as __emnapiGetDefaultContext,
	instantiateNapiModuleSync as __emnapiInstantiateNapiModuleSync,
} from '@napi-rs/wasm-runtime'

import __wasmUrl from './tevm_resolutions_rs.wasm32-wasi.wasm?url'

const __wasi = new __WASI({
	version: 'preview1',
})

const __emnapiContext = __emnapiGetDefaultContext()

const __sharedMemory = new WebAssembly.Memory({
	initial: 4000,
	maximum: 65536,
	shared: true,
})

const __wasmFile = await fetch(__wasmUrl).then((res) => res.arrayBuffer())

const {
	instance: __napiInstance,
	module: __wasiModule,
	napiModule: __napiModule,
} = __emnapiInstantiateNapiModuleSync(__wasmFile, {
	context: __emnapiContext,
	asyncWorkPoolSize: 4,
	wasi: __wasi,
	onCreateWorker() {
		const worker = new Worker(new URL('./wasi-worker-browser.mjs', import.meta.url), {
			type: 'module',
		})

		return worker
	},
	overwriteImports(importObject) {
		importObject.env = {
			...importObject.env,
			...importObject.napi,
			...importObject.emnapi,
			memory: __sharedMemory,
		}
		return importObject
	},
	beforeInit({ instance }) {
		__napi_rs_initialize_modules(instance)
	},
})

function __napi_rs_initialize_modules(__napiInstance) {
	__napiInstance.exports['__napi_register__JsResolvedImport_struct_0']?.()
	__napiInstance.exports['__napi_register__JsModuleInfo_struct_1']?.()
	__napiInstance.exports['__napi_register__JsModule_struct_2']?.()
	__napiInstance.exports['__napi_register__resolve_imports_js_3']?.()
	__napiInstance.exports['__napi_register__module_factory_js_4']?.()
}
export const _moduleFactoryJs = __napiModule.exports.moduleFactoryJs
export const _resolveImportsJs = __napiModule.exports.resolveImportsJs
