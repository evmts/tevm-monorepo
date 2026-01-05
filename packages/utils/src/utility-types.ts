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
