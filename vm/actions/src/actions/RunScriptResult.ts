import type { RunContractCallResult } from './RunContractCallResult.js'
import type { Abi } from 'abitype'

export type RunScriptResult<
	TAbi extends Abi | readonly unknown[] = Abi,
	TFunctionName extends string = string,
> = RunContractCallResult<TAbi, TFunctionName>
