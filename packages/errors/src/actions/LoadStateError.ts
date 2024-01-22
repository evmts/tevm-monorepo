import type { UnexpectedError } from '../UnexpectedError.js'
import type { InvalidRequestError } from '../input/index.js'

/**
 * Error Returned by load state procedure
 * @example
 * const {errors} = await tevm.loadState()
 *
 * if (errors?.length) {
 *   console.log(errors[0].name) // InvalidAddressError
 *   console.log(errors[0].message) // Invalid address: 0x1234
 * }
 */
export type LoadStateError = InvalidRequestError | UnexpectedError
