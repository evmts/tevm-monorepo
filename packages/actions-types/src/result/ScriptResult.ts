import type { Abi } from '../common/index.js'
import type { ContractResult } from './ContractResult.js'
import type { ScriptError } from '@tevm/errors'
import type { ContractFunctionName } from '@tevm/utils'

export type ScriptResult<
	TAbi extends Abi | readonly unknown[] = Abi,
	TFunctionName extends ContractFunctionName<TAbi> = ContractFunctionName<TAbi>,
	TErrorType = ScriptError,
> = ContractResult<TAbi, TFunctionName, TErrorType>
