import type {
	DebugTraceCallParams,
	DebugTraceTransactionParams,
} from '../params/index.js'
import type { SerializeToJson } from '../utils/SerializeToJson.js'
import type { JsonRpcRequest } from './JsonRpcRequest.js'

// debug_traceTransaction
/**
 * JSON-RPC request for `debug_traceTransaction` method
 */
export type DebugTraceTransactionJsonRpcRequest = JsonRpcRequest<
	'debug_traceTransaction',
	SerializeToJson<DebugTraceTransactionParams>
>
// debug_traceCall
/**
 * JSON-RPC request for `debug_traceCall` method
 */
export type DebugTraceCallJsonRpcRequest = JsonRpcRequest<
	'debug_traceCall',
	SerializeToJson<DebugTraceCallParams>
>

export type DebugJsonRpcRequest =
	| DebugTraceTransactionJsonRpcRequest
	| DebugTraceCallJsonRpcRequest
