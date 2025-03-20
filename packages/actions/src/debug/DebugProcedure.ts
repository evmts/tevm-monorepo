import type {
	DebugTraceBlockJsonRpcRequest,
	DebugTraceCallJsonRpcRequest,
	DebugTraceTransactionJsonRpcRequest,
} from './DebugJsonRpcRequest.js'
import type {
	DebugTraceBlockJsonRpcResponse,
	DebugTraceCallJsonRpcResponse,
	DebugTraceTransactionJsonRpcResponse,
} from './DebugJsonRpcResponse.js'

/**
 * JSON-RPC procedure for `debug_traceTransaction`
 */
export type DebugTraceTransactionProcedure = (
	request: DebugTraceTransactionJsonRpcRequest,
) => Promise<DebugTraceTransactionJsonRpcResponse>

// debug_traceCall
/**
 * JSON-RPC procedure for `debug_traceCall`
 */
export type DebugTraceCallProcedure = (request: DebugTraceCallJsonRpcRequest) => Promise<DebugTraceCallJsonRpcResponse>

// debug_traceBlock
/**
 * JSON-RPC procedure for `debug_traceBlock`
 */
export type DebugTraceBlockProcedure = (
	request: DebugTraceBlockJsonRpcRequest,
) => Promise<DebugTraceBlockJsonRpcResponse>
