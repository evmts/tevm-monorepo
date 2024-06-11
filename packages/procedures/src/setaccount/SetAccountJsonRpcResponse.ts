import type { SetAccountResult, TevmSetAccountError } from '@tevm/actions'
import type { JsonRpcResponse } from '@tevm/jsonrpc'
import type { SerializeToJson } from '../utils/SerializeToJson.js'

/**
 * JSON-RPC response for `tevm_setAccount` method
 */
export type SetAccountJsonRpcResponse = JsonRpcResponse<
	'tevm_setAccount',
	SerializeToJson<SetAccountResult>,
	TevmSetAccountError['code']
>
