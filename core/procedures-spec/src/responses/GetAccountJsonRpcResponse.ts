import type { SerializeToJson } from '../utils/SerializeToJson.js'
import type { JsonRpcResponse } from '@tevm/jsonrpc'
import type { GetAccountError, GetAccountResult } from '@tevm/actions-spec'

/**
 * JSON-RPC response for `tevm_getAccount` method
 */
export type GetAccountJsonRpcResponse = JsonRpcResponse<
	'tevm_getAccount',
	SerializeToJson<GetAccountResult>,
	GetAccountError['_tag']
>
