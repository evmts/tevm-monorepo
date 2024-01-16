import type { TraceCallParams } from '../params/TraceCallParams.js'
import type { SerializeToJson } from '../utils/SerializeToJson.js'
import type { JsonRpcRequest } from './JsonRpcRequest.js'

// tevm_traceCall
/**
 * JSON-RPC request for `tevm_traceCall` method
 */
export type TraceCallJsonRpcRequest = JsonRpcRequest<
	'debug_traceCall',
	SerializeToJson<TraceCallParams>
>

