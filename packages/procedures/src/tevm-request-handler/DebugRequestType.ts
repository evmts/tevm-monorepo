import type { DebugTraceCallJsonRpcRequest, DebugTraceTransactionJsonRpcRequest } from '../debug/index.js'

/**
 * A mapping of `debug_*` method names to their request type
 */
export type DebugRequestType = {
	debug_traceTransaction: DebugTraceTransactionJsonRpcRequest
	debug_traceCall: DebugTraceCallJsonRpcRequest
}
