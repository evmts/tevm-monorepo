// debug_traceTransaction

import type {
	DebugTraceCallResult,
	DebugTraceTransactionResult,
} from '../result/index.js'
import type { SerializeToJson } from '../utils/SerializeToJson.js'
import type { JsonRpcResponse } from './JsonRpcResponse.js'

// TODO type the errors strongly
type DebugError = string

/**
 * JSON-RPC response for `debug_traceTransaction` procedure
 */
export type DebugTraceTransactionJsonRpcResponse = JsonRpcResponse<
	'debug_traceTransaction',
	SerializeToJson<DebugTraceTransactionResult>,
	DebugError
>
// debug_traceCall
/**
 * JSON-RPC response for `debug_traceCall` procedure
 */
export type DebugTraceCallJsonRpcResponse = JsonRpcResponse<
	'debug_traceCall',
	SerializeToJson<DebugTraceCallResult>,
	DebugError
>
