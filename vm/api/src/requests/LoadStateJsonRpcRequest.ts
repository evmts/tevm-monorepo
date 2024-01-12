import type { SerializeToJson } from '../utils/SerializeToJson.js'
import type { JsonRpcRequest } from './JsonRpcRequest.js'
import type { SerializableTevmState } from '@tevm/state'

/**
 * The parameters for the `tevm_script` method
 * The higher level handler method takes abi functionName and args
 * But to serialize it over jsonrpc we need to serialize the data
 * the same way normal contract calls are serialized into functionData
 */
type SerializedParams = {
	state: SerializeToJson<SerializableTevmState>
}

/**
 * The JSON-RPC request for the `tevm_script` method
 */
export type LoadStateJsonRpcRequest = JsonRpcRequest<
	'tevm_load_state',
	SerializedParams
>
