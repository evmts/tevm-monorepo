import type { EVM } from '@ethereumjs/evm'
import type { Abi } from 'abitype'
import type { RunScriptAction, RunScriptResult } from '../index.js'

export type RunScriptHandler = <
	TAbi extends Abi | readonly unknown[] = Abi,
	TFunctionName extends string = string,
>(
	evm: EVM,
	{
		deployedBytecode,
		args,
		abi,
		caller,
		functionName,
	}: RunScriptAction<TAbi, TFunctionName>,
) => Promise<RunScriptResult<TAbi, TFunctionName>>
