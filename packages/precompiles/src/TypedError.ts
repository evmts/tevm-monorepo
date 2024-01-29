export type TypedError<TName extends string> = {
	_tag: TName
	name: TName
	message: string
}
