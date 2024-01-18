import type { GetAccountError, GetAccountResult } from '../index.js'
import type { SerializeToJson } from '../utils/SerializeToJson.js'
import type { JsonRpcResponse } from './JsonRpcResponse.js'

/**
 * JSON-RPC response for `tevm_getAccount` method
 */
export type GetAccountJsonRpcResponse = JsonRpcResponse<
	'tevm_account',
	SerializeToJson<GetAccountResult>,
	GetAccountError['_tag']
>
