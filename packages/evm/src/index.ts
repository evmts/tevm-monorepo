export type { CreateEvmOptions } from './CreateEvmOptions.js'
export type { CustomPrecompile } from './CustomPrecompile.js'
export { createEvm } from './createEvm.js'
export { Evm } from './Evm.js'
export type { EVMOpts } from './EvmOpts.js'
export type { Evm as EvmType } from './EvmType.js'
export type {
	ExecResult,
	EvmRunCallOpts,
	EvmResult,
	PrecompileInput,
	InterpreterStep,
	EvmBlockContext,
	EvmLog,
	EvmExceptionError,
	OpcodeInfo,
} from './types.js'
// Native EvmError implementation (migrated from @ethereumjs/evm)
export { EvmError, EVMErrorMessage, EVMErrorTypeString } from './EvmError.js'
// Guillotine WASM integration (pending WASM build)
export {
	loadGuillotineWasm,
	isGuillotineLoaded,
	getGuillotineInstance,
	resetGuillotineInstance,
	createGuillotineEvm,
	destroyGuillotineEvm,
	executeGuillotine,
	setStorage,
	getStorage,
	hexToAddress,
	u256ToBytes,
	bytesToU256,
} from './guillotineWasm.js'
