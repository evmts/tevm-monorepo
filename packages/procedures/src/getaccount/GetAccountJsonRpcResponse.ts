import type { GetAccountResult } from '@tevm/actions'
import type { JsonRpcResponse } from '@tevm/jsonrpc'
import type { SerializeToJson } from '../utils/SerializeToJson.js'
import type { TevmGetAccountError } from '../../../actions/dist/index.cjs'

/**
 * JSON-RPC response for `tevm_getAccount` method
 */
export type GetAccountJsonRpcResponse = JsonRpcResponse<
	'tevm_getAccount',
	SerializeToJson<GetAccountResult>,
	TevmGetAccountError['code']
>
