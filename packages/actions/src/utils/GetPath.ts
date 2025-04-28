/**
 * Helper type to get a nested property from an object
 */
export type GetPath<T, TPath extends string> = TPath extends `${infer A}.${infer Rest}`
	? A extends keyof T
		? { [K in A]: GetPath<T[A], Rest> }
		: never
	: TPath extends keyof T
		? { [K in TPath]: T[TPath] }
		: never
