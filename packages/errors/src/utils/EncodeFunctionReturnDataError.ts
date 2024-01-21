import type { TypedError } from '../TypedError.js'

/**
 * Error thrown when encoding function data fails
 * Not expected to be thrown because the initial validation
 * should have caught any errors and thrown more specific errors
 */
export type EncodeFunctionReturnDataError =
	TypedError<'EncodeFunctionReturnDataError'>
