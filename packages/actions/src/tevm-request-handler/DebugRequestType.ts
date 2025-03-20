import type {
	DebugTraceBlockJsonRpcRequest,
	DebugTraceCallJsonRpcRequest,
	DebugTraceTransactionJsonRpcRequest,
} from '../debug/DebugJsonRpcRequest.js'

/**
 * A mapping of `debug_*` method names to their request type
 */
export type DebugRequestType = {
	debug_traceTransaction: DebugTraceTransactionJsonRpcRequest
	debug_traceCall: DebugTraceCallJsonRpcRequest
	debug_traceBlock: DebugTraceBlockJsonRpcRequest
}
