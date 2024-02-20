/**
 * @internal
 * A minimally typesafe type for thottle fn that isn't expected to care about return type
 */
export type ThrottleFn = <TFunction extends (...args: any[]) => any>(
	func: TFunction,
	wait?: number,
) => TFunction
