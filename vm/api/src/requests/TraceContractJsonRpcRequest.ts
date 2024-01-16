import type { TraceContractParams } from '../params/TraceContractParams.js'
import type { SerializeToJson } from '../utils/SerializeToJson.js'
import type { JsonRpcRequest } from './JsonRpcRequest.js'

// tevm_traceContract
/**
 * JSON-RPC request for `tevm_traceContract` method
 */
export type TraceContractJsonRpcRequest = JsonRpcRequest<
	'debug_traceContract',
	SerializeToJson<TraceContractParams>
>

