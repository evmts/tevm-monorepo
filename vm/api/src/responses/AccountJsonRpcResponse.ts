import type { AccountError, AccountResult } from '../index.js'
import type { SerializeToJson } from '../utils/SerializeToJson.js'
import type { JsonRpcResponse } from './JsonRpcResponse.js'

/**
 * JSON-RPC response for `tevm_account` procedure
 */
export type AccountJsonRpcResponse = JsonRpcResponse<
	'tevm_account',
	SerializeToJson<AccountResult>,
	AccountError['_tag']
>
