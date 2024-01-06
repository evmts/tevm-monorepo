import type { ScriptError, ScriptResult } from '../index.js'
import type { JsonRpcResponse } from './JsonRpcResponse.js'
import type { Abi } from 'abitype'
import type { ContractFunctionName } from 'viem'

export type ScriptJsonRpcResponse<
	TAbi extends Abi = Abi,
	TFunctionName extends ContractFunctionName<TAbi> = ContractFunctionName<TAbi>,
> = JsonRpcResponse<
	'tevm_script',
	ScriptResult<TAbi, TFunctionName>,
	ScriptError['_tag']
>
