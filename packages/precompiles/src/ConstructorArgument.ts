/**
 * Infers the the first argument of a class
 */
export type ConstructorArgument<T> = T extends new (
	...args: infer P
) => any
	? P[0]
	: never
