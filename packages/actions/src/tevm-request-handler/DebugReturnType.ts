import type {
	DebugTraceBlockJsonRpcResponse,
	DebugTraceCallJsonRpcResponse,
	DebugTraceTransactionJsonRpcResponse,
} from '../debug/DebugJsonRpcResponse.js'

/**
 * A mapping of `debug_*` method names to their return type
 */
export type DebugReturnType = {
	debug_traceTransaction: DebugTraceTransactionJsonRpcResponse
	debug_traceCall: DebugTraceCallJsonRpcResponse
	debug_traceBlock: DebugTraceBlockJsonRpcResponse
}
