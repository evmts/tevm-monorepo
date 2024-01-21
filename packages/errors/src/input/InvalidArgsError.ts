import type { TypedError } from '../TypedError.js'

/**
 * Error thrown when arguments provided to a contract or script call are invalid
 */
export type InvalidArgsError = TypedError<'InvalidArgsError'>
