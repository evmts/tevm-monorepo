import type { DebugTraceCallJsonRpcRequest, DebugTraceTransactionJsonRpcRequest } from './DebugJsonRpcRequest.js'
import type { DebugTraceCallJsonRpcResponse, DebugTraceTransactionJsonRpcResponse } from './DebugJsonRpcResponse.js'

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
