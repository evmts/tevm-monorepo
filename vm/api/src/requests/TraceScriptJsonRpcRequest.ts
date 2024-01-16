import type { TraceScriptParams } from '../params/TraceScriptParams.js'
import type { SerializeToJson } from '../utils/SerializeToJson.js'
import type { JsonRpcRequest } from './JsonRpcRequest.js'

// tevm_traceScript
/**
 * JSON-RPC request for `tevm_traceScript` method
 */
export type TraceScriptJsonRpcRequest = JsonRpcRequest<
	'debug_traceScript',
	SerializeToJson<TraceScriptParams>
>

