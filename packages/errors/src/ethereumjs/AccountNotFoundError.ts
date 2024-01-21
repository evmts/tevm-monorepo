import type { TypedError } from '../TypedError.js'

/**
 * Error thrown when account cannot be found in the state
 */
export type AccountNotFoundError = TypedError<'AccountNotFoundError'>
