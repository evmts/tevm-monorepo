import type { AccountParams } from '../index.js'
import type { SerializeToJson } from '../utils/SerializeToJson.js'
import type { JsonRpcRequest } from './JsonRpcRequest.js'

/**
 * JSON-RPC request for `tevm_account` method
 */
export type AccountJsonRpcRequest = JsonRpcRequest<
	'tevm_account',
	SerializeToJson<AccountParams>
>
