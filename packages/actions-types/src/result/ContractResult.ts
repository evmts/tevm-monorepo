import type { ContractError } from '@tevm/errors'
import type { ContractFunctionName, DecodeFunctionResultReturnType } from '@tevm/utils'
import type { Abi } from '../common/index.js'
import type { CallResult } from './CallResult.js'

export type ContractResult<
	TAbi extends Abi | readonly unknown[] = Abi,
	TFunctionName extends ContractFunctionName<TAbi> = ContractFunctionName<TAbi>,
	ErrorType = ContractError,
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
