import type { ContractFunctionName } from '@tevm/utils'
import type { ContractResult } from '../Contract/ContractResult.js'
import type { Abi } from '../common/index.js'
import type { TevmScriptError } from './TevmScriptError.js'

/**
 * @deprecated Can use `ContractResult` instead
 */
export type ScriptResult<
	TAbi extends Abi | readonly unknown[] = Abi,
	TFunctionName extends ContractFunctionName<TAbi> = ContractFunctionName<TAbi>,
	TErrorType = TevmScriptError,
> = ContractResult<TAbi, TFunctionName, TErrorType>
