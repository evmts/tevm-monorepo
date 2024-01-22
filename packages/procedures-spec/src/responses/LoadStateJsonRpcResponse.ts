import type { SerializeToJson } from '../utils/SerializeToJson.js'
import type { LoadStateResult } from '@tevm/actions-types'
import type { LoadStateError } from '@tevm/errors'
import type { JsonRpcResponse } from '@tevm/jsonrpc'

/**
 * Response of the `tevm_loadState` RPC method.
 */
export type LoadStateJsonRpcResponse = JsonRpcResponse<
	'tevm_loadState',
	SerializeToJson<LoadStateResult>,
	LoadStateError['_tag']
>
