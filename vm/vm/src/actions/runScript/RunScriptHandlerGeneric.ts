import type { Abi } from 'abitype'
import type { Tevm } from '../../tevm.js'
import type { RunScriptAction } from './RunScriptAction.js'
import type { RunScriptResult } from './RunScriptResult.js'

export type RunScriptHandler = <
	TAbi extends Abi | readonly unknown[] = Abi,
	TFunctionName extends string = string,
>(
	tevm: Tevm,
	{
		deployedBytecode,
		args,
		abi,
		caller,
		functionName,
	}: RunScriptAction<TAbi, TFunctionName>,
) => Promise<RunScriptResult<TAbi, TFunctionName>> 
