import type { ParameterizedTevmState } from '@tevm/state'
import type { SerializeToJson } from '../utils/SerializeToJson.js'
import type { JsonRpcRequest } from './JsonRpcRequest.js'

/**
 * The parameters for the `tevm_loadState` method
 */
type SerializedParams = {
	state: SerializeToJson<ParameterizedTevmState>
}

/**
 * The JSON-RPC request for the `tevm_loadState` method
 */
export type LoadStateJsonRpcRequest = JsonRpcRequest<
	'tevm_loadState',
	SerializedParams
>
