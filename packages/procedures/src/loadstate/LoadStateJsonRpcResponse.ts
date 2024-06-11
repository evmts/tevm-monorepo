import type { LoadStateResult, TevmLoadStateError } from '@tevm/actions'
import type { JsonRpcResponse } from '@tevm/jsonrpc'
import type { SerializeToJson } from '../utils/SerializeToJson.js'

/**
 * Response of the `tevm_loadState` RPC method.
 */
export type LoadStateJsonRpcResponse = JsonRpcResponse<
	'tevm_loadState',
	SerializeToJson<LoadStateResult>,
	TevmLoadStateError['code']
>
