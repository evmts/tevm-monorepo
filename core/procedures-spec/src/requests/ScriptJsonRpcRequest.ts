import type { BaseCallParams } from '../index.js'
import type { SerializeToJson } from '../utils/SerializeToJson.js'
import type { JsonRpcRequest } from './JsonRpcRequest.js'
import type { Hex } from 'viem'

/**
 * The parameters for the `tevm_script` method
 * The higher level handler method takes abi functionName and args
 * But to serialize it over jsonrpc we need to serialize the data
 * the same way normal contract calls are serialized into functionData
 */
type SerializedParams = SerializeToJson<BaseCallParams> & {
	/**
	 * The raw call data
	 */
	data: Hex
	/**
	 * The deployed bytecode of the contract.
	 */
	deployedBytecode: Hex
}

/**
 * The JSON-RPC request for the `tevm_script` method
 */
export type ScriptJsonRpcRequest = JsonRpcRequest<
	'tevm_script',
	SerializedParams
>
