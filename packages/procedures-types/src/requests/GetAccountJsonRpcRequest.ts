import type { SerializeToJson } from '../utils/SerializeToJson.js'
import type { GetAccountParams } from '@tevm/actions-types'
import type { JsonRpcRequest } from '@tevm/jsonrpc'

/**
 * JSON-RPC request for `tevm_getAccount` method
 */
export type GetAccountJsonRpcRequest = JsonRpcRequest<
	'tevm_getAccount',
	[SerializeToJson<GetAccountParams>]
>
