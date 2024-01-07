export type TypedError<TName extends string, TMeta = never> = {
	_tag: TName
	name: TName
	message: string
	meta?: TMeta
}
