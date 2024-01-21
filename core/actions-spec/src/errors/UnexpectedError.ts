import type { TypedError } from './TypedError.js'

/**
 * Error representing an unknown error occurred
 * It should never get thrown. This error being thrown
 * means an error wasn't properly handled already
 */
export type UnexpectedError = TypedError<'UnexpectedError'>
