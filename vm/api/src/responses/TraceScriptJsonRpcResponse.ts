// debug_traceTransaction

import type { TraceScriptResult } from '../result/TraceScriptResult.js'
import type { SerializeToJson } from '../utils/SerializeToJson.js'
import type { JsonRpcResponse } from './JsonRpcResponse.js'

// TODO type the errors strongly
type TraceScriptError = string

// debug_traceScript
/**
 * JSON-RPC response for `debug_traceScript` procedure
 */
export type TraceScriptJsonRpcResponse = JsonRpcResponse<
	'tevm_traceScript',
	SerializeToJson<TraceScriptResult>,
	TraceScriptError
>
