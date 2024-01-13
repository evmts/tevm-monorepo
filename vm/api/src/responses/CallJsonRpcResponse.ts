import type { CallError, CallResult } from '../index.js'
import type { SerializeToJson } from '../utils/SerializeToJson.js'
import type { JsonRpcResponse } from './JsonRpcResponse.js'

/**
 * JSON-RPC response for `tevm_call` procedure
 */
export type CallJsonRpcResponse = JsonRpcResponse<
	'tevm_call',
	SerializeToJson<CallResult>,
	CallError['_tag']
>
