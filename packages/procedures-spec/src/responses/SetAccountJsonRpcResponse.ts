import type { SerializeToJson } from '../utils/SerializeToJson.js'
import type { SetAccountError, SetAccountResult } from '@tevm/actions-spec'
import type { JsonRpcResponse } from '@tevm/jsonrpc'

/**
 * JSON-RPC response for `tevm_setAccount` method
 */
export type SetAccountJsonRpcResponse = JsonRpcResponse<
	'tevm_setAccount',
	SerializeToJson<SetAccountResult>,
	SetAccountError['_tag']
>
