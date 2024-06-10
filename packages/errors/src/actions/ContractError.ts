import type { ExecutionRevertedError } from 'viem'
import type { ExecutionError } from '../ethereum/ExecutionErrorError.js'
import type { InvalidAddressError } from '../ethereum/InvalidAddressError.js'
import type {
	InvalidAbiError,
	InvalidArgsError,
	InvalidDataError,
	InvalidFunctionNameError,
	InvalidRequestError,
} from '../input/index.js'
import type { DecodeFunctionDataError, EncodeFunctionReturnDataError } from '../utils/index.js'
import type { BaseCallError } from './BaseCallError.js'

/***
 * Errors returned by contract tevm procedure
 * @example
 * const {errors} = await tevm.contract({address: '0x1234'})
 * if (errors?.length) {
 *   console.log(errors[0].name) // InvalidAddressError
 * }
 */
export type ContractError =
	| BaseCallError
	| InvalidAddressError
	| ExecutionError
	| ExecutionRevertedError
	| InvalidRequestError
	| InvalidAbiError
	| InvalidDataError
	| InvalidFunctionNameError
	| InvalidArgsError
	| DecodeFunctionDataError
	| EncodeFunctionReturnDataError
