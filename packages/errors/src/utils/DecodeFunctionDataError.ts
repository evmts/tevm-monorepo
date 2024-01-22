import type { TypedError } from '../TypedError.js'

/**
 * Error thrown when decoding function data fails
 * Not expected to be thrown unless ABI is incorrect
 * @example
 * const {errors} = await tevm.call({address: '0x1234'})
 * errors.forEach(error => {
 *   if (error.name === 'DecodeFunctionDataError') {
 *     console.log(error.message)
 *   }
 * })
 */
export type DecodeFunctionDataError = TypedError<'DecodeFunctionDataError'>
