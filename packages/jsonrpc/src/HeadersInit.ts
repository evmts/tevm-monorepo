/**
 * The headers interface of the Fetch API
 */
export type HeadersInit =
	| string[][]
	| Record<string, string | ReadonlyArray<string>>
	| Headers
