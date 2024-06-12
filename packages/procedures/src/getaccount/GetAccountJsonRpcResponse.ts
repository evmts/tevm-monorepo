import type { GetAccountResult } from '@tevm/actions'
import type { JsonRpcResponse } from '@tevm/jsonrpc'
import type { TevmGetAccountError } from '../../../actions/dist/index.cjs'
import type { SerializeToJson } from '../utils/SerializeToJson.js'

/**
 * JSON-RPC response for `tevm_getAccount` method
 */
export type GetAccountJsonRpcResponse = JsonRpcResponse<
	'tevm_getAccount',
	SerializeToJson<GetAccountResult>,
	TevmGetAccountError['code']
>
