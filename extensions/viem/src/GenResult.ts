import type { TypedError } from './TypedError.js'

/**
 * @experimental
 * A result type for a single yield of writeContractOptimistic
 */
export type GenResult<TDataType, TTag extends string> = {
	success: true
	tag: TTag
	data: TDataType
	errors?: ReadonlyArray<TypedError<string>>
}
