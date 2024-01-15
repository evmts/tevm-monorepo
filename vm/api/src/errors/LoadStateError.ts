import type { InvalidRequestError } from './InvalidRequestError.js'
import type { UnexpectedError } from './UnexpectedError.js'

/**
 * Error Returned by load state procedure
 * @example
 * const {errors} = await tevm.loadState({state})
 * if (errors?.length) {
 *  console.log(errors[0].name) // InvalidRequestError
 * }
 */
export type LoadStateError = InvalidRequestError | UnexpectedError
