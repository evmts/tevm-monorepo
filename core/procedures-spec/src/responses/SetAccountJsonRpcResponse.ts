import type { SerializeToJson } from '../utils/SerializeToJson.js'
import type { JsonRpcResponse } from '@tevm/jsonrpc'
import type { SetAccountError, SetAccountResult } from '@tevm/actions-spec'

/**
 * JSON-RPC response for `tevm_setAccount` method
 */
export type SetAccountJsonRpcResponse = JsonRpcResponse<
	'tevm_setAccount',
	SerializeToJson<SetAccountResult>,
	SetAccountError['_tag']
>
