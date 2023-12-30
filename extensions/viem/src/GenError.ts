import type { TypedError } from './TypedError.js'

export type GenError<TErrorType, TTag extends string> = {
	errors?: ReadonlyArray<TypedError<string>>
	error: TErrorType
	success: false
	tag: TTag
}
