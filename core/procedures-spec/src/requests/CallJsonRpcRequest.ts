import type { CallParams } from '../index.js'
import type { SerializeToJson } from '../utils/SerializeToJson.js'
import type { JsonRpcRequest } from './JsonRpcRequest.js'

/**
 * JSON-RPC request for `tevm_call`
 */
export type CallJsonRpcRequest = JsonRpcRequest<
	'tevm_call',
	SerializeToJson<CallParams>
>
