/**
 * Represents a typed error with a tag for identification
 * @template TName The string literal type that identifies this error
 * @example
 * ```typescript
 * import { TypedError } from '@tevm/precompiles'
 *
 * type MyCustomError = TypedError<'MyCustomError'>
 *
 * const error: MyCustomError = {
 *   _tag: 'MyCustomError',
 *   name: 'MyCustomError',
 *   message: 'Something went wrong'
 * }
 * ```
 */
export type TypedError<TName extends string> = {
	_tag: TName
	name: TName
	message: string
}
