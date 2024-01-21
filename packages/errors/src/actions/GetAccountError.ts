import type { UnexpectedError } from '../UnexpectedError.js'
import type { AccountNotFoundError } from '../ethereumjs/index.js'
import type {
	InvalidAddressError,
	InvalidRequestError,
} from '../input/index.js'

/**
 * Errors returned by tevm_getAccount procedure
 * @example
 * const {errors} = await tevm.getAccount({address: '0x1234'})
 *
 * if (errors?.length) {
 *   console.log(errors[0].name) // InvalidAddressError
 *   console.log(errors[0].message) // Invalid address: 0x1234
 * }
 */
export type GetAccountError =
	| AccountNotFoundError
	| InvalidAddressError
	| InvalidRequestError
	| UnexpectedError
