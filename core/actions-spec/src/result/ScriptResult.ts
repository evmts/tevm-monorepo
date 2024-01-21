import type { ScriptError } from '../errors/ScriptError.js'
import type { ContractResult } from './ContractResult.js'
import type { Abi } from 'abitype'
import type { ContractFunctionName } from 'viem'

export type ScriptResult<
	TAbi extends Abi | readonly unknown[] = Abi,
	TFunctionName extends ContractFunctionName<TAbi> = ContractFunctionName<TAbi>,
	TErrorType = ScriptError,
> = ContractResult<TAbi, TFunctionName, TErrorType>
