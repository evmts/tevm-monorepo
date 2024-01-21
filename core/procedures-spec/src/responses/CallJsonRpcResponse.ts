import type { SerializeToJson } from '../utils/SerializeToJson.js'
import type { JsonRpcResponse } from './JsonRpcResponse.js'
import type { CallError, CallResult } from '@tevm/actions-spec'

/**
 * JSON-RPC response for `tevm_call` procedure
 */
export type CallJsonRpcResponse = JsonRpcResponse<
	'tevm_call',
	SerializeToJson<CallResult>,
	CallError['_tag']
>
