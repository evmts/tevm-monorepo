// debug_traceTransaction

import type { TraceContractResult } from '../result/TraceContractResult.js'
import type { SerializeToJson } from '../utils/SerializeToJson.js'
import type { JsonRpcResponse } from './JsonRpcResponse.js'

// TODO type the errors strongly
type TraceContractError = string

// debug_traceContract
/**
 * JSON-RPC response for `debug_traceContract` procedure
 */
export type TraceContractJsonRpcResponse = JsonRpcResponse<
	'tevm_traceContract',
	SerializeToJson<TraceContractResult>,
	TraceContractError
>
