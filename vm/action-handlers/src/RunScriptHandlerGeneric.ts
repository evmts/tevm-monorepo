import type { EVM } from '@ethereumjs/evm'
import type { RunScriptAction, RunScriptResponse } from '@tevm/actions'
import type { Abi } from 'abitype'

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
) => Promise<RunScriptResponse<TAbi, TFunctionName>>
