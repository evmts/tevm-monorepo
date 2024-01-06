import type {
	JsonRpcRequest,
	JsonRpcResponse,
	ScriptError,
	ScriptParams,
	ScriptResult,
} from '../index.js'
import type { Abi } from 'abitype'
import type { ContractFunctionName } from 'viem'

export type ScriptJsonRpcProcedure = <
	TAbi extends Abi,
	TFunctionName extends ContractFunctionName<TAbi>,
>(
	request: JsonRpcRequest<'tevm_script', ScriptParams<TAbi, TFunctionName>>,
) => Promise<
	JsonRpcResponse<
		'tevm_script',
		ScriptResult<TAbi, TFunctionName, never>,
		ScriptError['_tag']
	>
>
