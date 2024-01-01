import type { ScriptError, ScriptResult } from '../index.js'
import type { JsonRpcResponse } from './JsonRpcResponse.js'
import type { Abi } from 'abitype'

export type ScriptJsonRpcResponse<
	TAbi extends Abi = Abi,
	TFunctionName extends string = string,
> = JsonRpcResponse<
	'tevm_script',
	ScriptResult<TAbi, TFunctionName>,
	ScriptError['_tag']
>
