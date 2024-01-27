import type { UnexpectedError } from '../UnexpectedError.js'
import type { InvalidBlockError, TypedError } from '../index.js'
import type { InvalidUrlError } from '../input/InvalidUrlError.js'

export type FailedToForkError = TypedError<'FailedToForkError'>

/**
 * Error Returned by `tevm_fork` procedure
 * @example
 * const res = await tevm.fork()
 *
 * if (res.errors?.length) {
 *   console.log(res.errors[0].name) // Unable to fork because eth_blockNumber returned an error
 *   console.log(res.errors[0].message) // fork url returned a 503 forbidden error
 * }
 * @see {@link InvalidBlockError}
 * @see {@link FailedToForkError}
 * @see {@link UnexpectedError}
 * @see {@link InvalidUrlError}
 */
export type ForkError =
	| InvalidUrlError
	| InvalidBlockError
	| FailedToForkError
	| UnexpectedError
