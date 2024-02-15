import type { SerializeToJson } from '../utils/SerializeToJson.js'
import type { SetAccountParams } from '@tevm/actions-types'
import type { JsonRpcRequest } from '@tevm/jsonrpc'

/**
 * JSON-RPC request for `tevm_setAccount` method
 */
export type SetAccountJsonRpcRequest = JsonRpcRequest<
	'tevm_setAccount',
	[SerializeToJson<SetAccountParams>]
>
