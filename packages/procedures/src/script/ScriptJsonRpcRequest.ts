import type { BaseCallParams } from '@tevm/actions'
import type { JsonRpcRequest } from '@tevm/jsonrpc'
import type { Hex } from '@tevm/utils'
import type { SerializeToJson } from '../utils/SerializeToJson.js'

/**
 * @deprecated Use CallJsonRpcProcedure instead
 * The JSON-RPC request for the `tevm_script` method
 */
export type ScriptJsonRpcRequest = JsonRpcRequest<
	'tevm_script',
	/**
	 * The parameters for the `tevm_script` method
	 * The higher level handler method takes abi functionName and args
	 * But to serialize it over jsonrpc we need to serialize the data
	 * the same way normal contract calls are serialized into functionData
	 */
	[
		params: SerializeToJson<Omit<BaseCallParams, 'stateOverrideSet' | 'blockOverrideSet'>> & {
			/**
			 * The raw call data
			 */
			data: Hex
			/**
			 * The deployed bytecode of the contract.
			 */
			deployedBytecode: Hex
		},
		stateOverrideSet?: SerializeToJson<BaseCallParams['stateOverrideSet']>,
		blockOverrideSet?: SerializeToJson<BaseCallParams['blockOverrideSet']>,
	]
>
