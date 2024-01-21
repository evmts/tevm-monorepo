/**
 * Internal utility for creating a typed error as typed by Tevm
 * `name` is analogous to `code` in a JSON RPC error and is the value used to discriminate errors
 * for tevm users.
 * `_tag` is same as name and used internally so it can be changed in non breaking way with regard to name
 * `message` is a human readable error message
 * `meta` is an optional object containing additional information about the error
 */
export type TypedError<TName extends string, TMeta = never> = {
	_tag: TName
	name: TName
	message: string
	meta?: TMeta
}
