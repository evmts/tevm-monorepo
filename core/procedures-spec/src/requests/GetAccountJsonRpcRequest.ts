import type { SerializeToJson } from '../utils/SerializeToJson.js'
import type { JsonRpcRequest } from './JsonRpcRequest.js'
import type { GetAccountParams } from '@tevm/actions-spec'

/**
 * JSON-RPC request for `tevm_getAccount` method
 */
export type GetAccountJsonRpcRequest = JsonRpcRequest<
	'tevm_getAccount',
	SerializeToJson<GetAccountParams>
>
