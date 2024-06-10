import type { ContractFunctionName, DecodeFunctionResultReturnType } from '@tevm/utils'
import type { Abi } from '../common/index.js'
import type { CallResult } from './CallResult.js'
import type { TevmContractError } from './TevmContractError.js'

export type ContractResult<
TAbi extends Abi | readonly unknown[] = Abi,
TFunctionName extends ContractFunctionName<TAbi> = ContractFunctionName<TAbi>,
ErrorType = TevmContractError,
> =
| (Omit<CallResult, 'errors'> & {
errors?: never
/**
* The parsed data
*/
data: DecodeFunctionResultReturnType<TAbi, TFunctionName>
})
| (CallResult<ErrorType> & {
data?: never
})
