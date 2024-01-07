import type { ContractError } from '../errors/ContractError.js'
import type { CallResult } from './CallResult.js'
import type { Abi } from 'abitype'
import {
	type ContractFunctionName,
	type DecodeFunctionResultReturnType,
} from 'viem'

export type ContractResult<
	TAbi extends Abi | readonly unknown[] = Abi,
	TFunctionName extends ContractFunctionName<TAbi> = ContractFunctionName<TAbi>,
	ErrorType = ContractError,
> = CallResult<ErrorType> & {
	/**
	 * The parsed data
	 */
	data: DecodeFunctionResultReturnType<TAbi, TFunctionName>
}
