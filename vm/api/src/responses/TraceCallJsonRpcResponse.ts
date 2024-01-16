// debug_traceTransaction

import type { TraceCallResult } from '../result/TraceCallResult.js'
import type { SerializeToJson } from '../utils/SerializeToJson.js'
import type { JsonRpcResponse } from './JsonRpcResponse.js'

// TODO type the errors strongly
type TraceCallError = string

// debug_traceCall
/**
 * JSON-RPC response for `debug_traceCall` procedure
 */
export type TraceCallJsonRpcResponse = JsonRpcResponse<
	'tevm_traceCall',
	SerializeToJson<TraceCallResult>,
	TraceCallError
>
