import type { UnexpectedError } from '../UnexpectedError.js'
import type { EvmError } from '../ethereumjs/index.js'
import type {
	InvalidAbiError,
	InvalidAddressError,
	InvalidArgsError,
	InvalidDataError,
	InvalidFunctionNameError,
	InvalidRequestError,
} from '../input/index.js'
import type {
	DecodeFunctionDataError,
	EncodeFunctionReturnDataError,
} from '../utils/index.js'
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
	| EvmError
	| InvalidRequestError
	| UnexpectedError
	| InvalidAbiError
	| InvalidDataError
	| InvalidFunctionNameError
	| InvalidArgsError
	// viem errors TODO catch all these
	| DecodeFunctionDataError
	| EncodeFunctionReturnDataError
