import type { SerializeToJson } from '../utils/SerializeToJson.js'
import type { JsonRpcRequest } from '@tevm/jsonrpc'
import type { CallParams } from '@tevm/actions-spec'

/**
 * JSON-RPC request for `tevm_call`
 */
export type CallJsonRpcRequest = JsonRpcRequest<
	'tevm_call',
	SerializeToJson<CallParams>
>
