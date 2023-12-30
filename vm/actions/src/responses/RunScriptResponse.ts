import type { RunContractCallResponse } from './RunContractCallResponse.js'
import type { Abi } from 'abitype'

export type RunScriptResponse<
	TAbi extends Abi | readonly unknown[] = Abi,
	TFunctionName extends string = string,
> = RunContractCallResponse<TAbi, TFunctionName>
