import type { InvalidAddressError } from './InvalidAddressError.js'
import type { InvalidBalanceError } from './InvalidBalanceError.js'
import type { InvalidBytecodeError } from './InvalidBytecodeError.js'
import type { InvalidNonceError } from './InvalidNonceError.js'
import type { InvalidRequestError } from './InvalidRequestError.js'
import type { InvalidStorageRootError } from './InvalidStorageRootError.js'
import type { UnexpectedError } from './UnexpectedError.js'

/**
 * Errors returned by account tevm procedure
 * @example
 * const {errors} = await tevm.account({address: '0x1234'})
 *
 * if (errors?.length) {
 *   console.log(errors[0].name) // InvalidAddressError
 *   console.log(errors[0].message) // Invalid address: 0x1234
 * }
 */
export type AccountError =
	| InvalidAddressError
	| InvalidBalanceError
	| InvalidNonceError
	| InvalidStorageRootError
	| InvalidBytecodeError
	| InvalidRequestError
	| UnexpectedError
