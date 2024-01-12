import type { InvalidRequestError } from './InvalidRequestError.js'
import type { UnexpectedError } from './UnexpectedError.js'

/**
 * Error Returned by dump state procedure
 * TODO : Give example call
 */
export type DumpStateError = InvalidRequestError | UnexpectedError
