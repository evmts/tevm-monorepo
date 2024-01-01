import type { ScriptError } from '../errors/ScriptError.js'
import type { ContractResult } from './ContractResult.js'
import type { Abi } from 'abitype'

export type ScriptResult<
	TAbi extends Abi | readonly unknown[] = Abi,
	TFunctionName extends string = string,
	TErrorType = ScriptError,
> = ContractResult<TAbi, TFunctionName, TErrorType>
