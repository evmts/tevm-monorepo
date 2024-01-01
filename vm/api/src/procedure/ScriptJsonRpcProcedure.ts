import type {
	JsonRpcRequest,
	JsonRpcResponse,
	ScriptError,
	ScriptParams,
	ScriptResult,
} from '../index.js'
import type { Abi } from 'abitype'

export type ScriptJsonRpcProcedure = <
	TAbi extends Abi,
	TFunctionName extends string,
>(
	request: JsonRpcRequest<'tevm_script', ScriptParams<TAbi, TFunctionName>>,
) => Promise<
	JsonRpcResponse<
		'tevm_script',
		ScriptResult<TAbi, TFunctionName, never>,
		ScriptError['_tag']
	>
>
