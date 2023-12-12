import type { Abi } from 'abitype'
import type { RunContractCallResult } from '../contractCall/RunContractCallResult.js'

export type RunScriptResult<
	TAbi extends Abi | readonly unknown[] = Abi,
	TFunctionName extends string = string,
> = RunContractCallResult<TAbi, TFunctionName>

