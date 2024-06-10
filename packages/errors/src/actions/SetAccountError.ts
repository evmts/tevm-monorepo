import type { InvalidAddressError } from '../ethereum/InvalidAddressError.js'
import type {
	InvalidBalanceError,
	InvalidBytecodeError,
	InvalidNonceError,
	InvalidRequestError,
	InvalidStorageRootError,
} from '../input/index.js'

/**
 * Errors returned by tevm_setAccount method
 * @example
 * const {errors} = await tevm.setAccount({address: '0x1234'})
 *
 * if (errors?.length) {
 *   console.log(errors[0].name) // InvalidAddressError
 *   console.log(errors[0].message) // Invalid address: 0x1234
 * }
 */
export type SetAccountError =
	| InvalidAddressError
	| InvalidBalanceError
	| InvalidNonceError
	| InvalidStorageRootError
	| InvalidBytecodeError
	| InvalidRequestError
