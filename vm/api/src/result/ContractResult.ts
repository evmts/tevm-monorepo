import type { ContractError } from '../errors/ContractError.js'
import type { CallResult } from './CallResult.js'
import type { Abi } from 'abitype'
import { type DecodeFunctionResultReturnType } from 'viem'

export type ContractResult<
	TAbi extends Abi | readonly unknown[] = Abi,
	TFunctionName extends string = string,
	ErrorType = ContractError,
> = CallResult<ErrorType> & {
	/**
	 * The parsed data
	 */
	data: DecodeFunctionResultReturnType<TAbi, TFunctionName>
}
