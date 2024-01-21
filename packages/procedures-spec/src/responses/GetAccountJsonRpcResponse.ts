import type { SerializeToJson } from '../utils/SerializeToJson.js'
import type { GetAccountError, GetAccountResult } from '@tevm/actions-types'
import type { JsonRpcResponse } from '@tevm/jsonrpc'

/**
 * JSON-RPC response for `tevm_getAccount` method
 */
export type GetAccountJsonRpcResponse = JsonRpcResponse<
	'tevm_getAccount',
	SerializeToJson<GetAccountResult>,
	GetAccountError['_tag']
>
