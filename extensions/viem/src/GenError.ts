import type { TypedError } from './TypedError.js'

/**
 * An error yield of writeContractOptimistic
 * Errors are yielded rather than throwing
 */
export type GenError<TErrorType, TTag extends string> = {
	errors?: ReadonlyArray<TypedError<string>>
	error: TErrorType
	success: false
	tag: TTag
}
