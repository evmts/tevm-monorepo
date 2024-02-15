import type { SerializeToJson } from '../utils/SerializeToJson.js'
import type { JsonRpcRequest } from '@tevm/jsonrpc'
import type { ParameterizedTevmState } from '@tevm/state'

/**
 * The parameters for the `tevm_loadState` method
 */
export type SerializedParams = {
	state: SerializeToJson<ParameterizedTevmState>
}

/**
 * The JSON-RPC request for the `tevm_loadState` method
 */
export type LoadStateJsonRpcRequest = JsonRpcRequest<
	'tevm_loadState',
	[SerializedParams]
>
