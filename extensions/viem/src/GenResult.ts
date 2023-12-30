import type { TypedError } from "./TypedError.js"

export type GenResult<TDataType, TTag extends string> = {
	success: true
	tag: TTag
	data: TDataType
	errors?: ReadonlyArray<TypedError<string>>
}

