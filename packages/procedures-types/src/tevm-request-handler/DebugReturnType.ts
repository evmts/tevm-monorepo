import type {
	DebugTraceCallJsonRpcResponse,
	DebugTraceTransactionJsonRpcResponse,
} from '../index.js'

/**
 * A mapping of `debug_*` method names to their return type
 */
export type DebugReturnType = {
	debug_traceTransaction: DebugTraceTransactionJsonRpcResponse
	debug_traceCall: DebugTraceCallJsonRpcResponse
}
