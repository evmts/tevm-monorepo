import type { SetAccountResult } from '@tevm/actions'
import type { SetAccountError } from '@tevm/errors'
import type { JsonRpcResponse } from '@tevm/jsonrpc'
import type { SerializeToJson } from '../utils/SerializeToJson.js'

/**
 * JSON-RPC response for `tevm_setAccount` method
 */
export type SetAccountJsonRpcResponse = JsonRpcResponse<
	'tevm_setAccount',
	SerializeToJson<SetAccountResult>,
	SetAccountError['_tag']
>
