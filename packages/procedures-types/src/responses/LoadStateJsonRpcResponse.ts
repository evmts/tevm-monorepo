import type { LoadStateResult } from '@tevm/actions'
import type { LoadStateError } from '@tevm/errors'
import type { JsonRpcResponse } from '@tevm/jsonrpc'
import type { SerializeToJson } from '../utils/SerializeToJson.js'

/**
 * Response of the `tevm_loadState` RPC method.
 */
export type LoadStateJsonRpcResponse = JsonRpcResponse<
	'tevm_loadState',
	SerializeToJson<LoadStateResult>,
	LoadStateError['_tag']
>
