import type { BaseCallParams } from '../index.js'
import type { SerializeToJson } from '../utils/SerializeToJson.js'
import type { JsonRpcRequest } from './JsonRpcRequest.js'
import type { Hex } from 'viem'

type SerializedParams = SerializeToJson<BaseCallParams> & {
	/**
	 * The deployed bytecode of the contract.
	 */
	deployedBytecode: Hex
}

export type ScriptJsonRpcRequest = JsonRpcRequest<'tevm_script', SerializedParams>
