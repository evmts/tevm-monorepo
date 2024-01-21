import type { SerializeToJson } from '../utils/SerializeToJson.js'
import type { JsonRpcResponse } from '@tevm/jsonrpc'
import type { LoadStateResult } from '@tevm/actions-spec'
import type { LoadStateError } from '@tevm/errors'

/**
 * Response of the `tevm_loadState` RPC method.
 */
export type LoadStateJsonRpcResponse = JsonRpcResponse<
	'tevm_loadState',
	SerializeToJson<LoadStateResult>,
	LoadStateError['_tag']
>
