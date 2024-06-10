import type { TevmScriptError } from './TevmScriptError.js'
import type { ContractFunctionName } from '@tevm/utils'
import type { Abi } from '../common/index.js'
import type { ContractResult } from './ContractResult.js'

export type ScriptResult<
TAbi extends Abi | readonly unknown[] = Abi,
TFunctionName extends ContractFunctionName<TAbi> = ContractFunctionName<TAbi>,
TErrorType = TevmScriptError,
> = ContractResult<TAbi, TFunctionName, TErrorType>
