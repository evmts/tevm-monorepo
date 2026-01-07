/**
 * Utility types (native implementations)
 *
 * This module provides common utility types used throughout tevm,
 * reducing the need to import them from external dependencies like viem.
 * @module
 */

/**
 * Flattens mapped types for better display in IDE tooltips and error messages.
 *
 * This is a native replacement for viem's Prettify type.
 * It forces TypeScript to evaluate and expand an object type, making it easier
 * to read in type definitions and error messages.
 *
 * @template T - The type to prettify
 *
 * @example
 * ```typescript
 * import type { Prettify } from '@tevm/utils'
 *
 * // Without Prettify:
 * // type Merged = Pick<A, "a"> & Pick<B, "b">
 *
 * // With Prettify:
 * // type Merged = { a: string; b: number }
 * type Merged = Prettify<Pick<A, 'a'> & Pick<B, 'b'>>
 * ```
 */
export type Prettify<T> = {
	[K in keyof T]: T[K]
} & {}

/**
 * Makes all properties of an object type optional, including explicitly allowing undefined.
 *
 * This is a native replacement for viem's ExactPartial type.
 * Unlike TypeScript's built-in Partial<T>, ExactPartial ensures that
 * each property explicitly accepts undefined, making it more precise
 * for optional object parameters.
 *
 * @template T - The type to make partial
 *
 * @example
 * ```typescript
 * import type { ExactPartial } from '@tevm/utils'
 *
 * type User = {
 *   name: string
 *   age: number
 * }
 *
 * // All properties are optional and explicitly allow undefined
 * type PartialUser = ExactPartial<User>
 * // Equivalent to: { name?: string | undefined; age?: number | undefined }
 *
 * const user: PartialUser = { name: 'Alice' } // age is optional
 * ```
 */
export type ExactPartial<T> = {
	[K in keyof T]?: T[K] | undefined
}
