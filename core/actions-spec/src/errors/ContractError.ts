import type { BaseCallError } from './BaseCallError.js'
import type { DecodeFunctionDataError } from './DecodeFunctionDataError.js'
import type { EncodeFunctionReturnDataError } from './EncodeFunctionReturnDataError.js'
import type { EvmError } from './EvmError.js'
import type { InvalidAbiError } from './InvalidAbiError.js'
import type { InvalidAddressError } from './InvalidAddressError.js'
import type { InvalidArgsError } from './InvalidArgsError.js'
import type { InvalidDataError } from './InvalidDataError.js'
import type { InvalidFunctionNameError } from './InvalidFunctionNameError.js'
import type { InvalidRequestError } from './InvalidRequestError.js'
import type { UnexpectedError } from './UnexpectedError.js'

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
