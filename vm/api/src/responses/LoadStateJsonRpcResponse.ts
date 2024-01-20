import type { LoadStateError } from '../errors/LoadStateError.js'
import type { LoadStateResult } from '../result/LoadStateResult.js'
import type { SerializeToJson } from '../utils/SerializeToJson.js'
import type { JsonRpcResponse } from './JsonRpcResponse.js'

/**
 * Response of the `tevm_loadState` RPC method.
 */
export type LoadStateJsonRpcResponse = JsonRpcResponse<
	'tevm_loadState',
	SerializeToJson<LoadStateResult>,
	LoadStateError['_tag']
>
