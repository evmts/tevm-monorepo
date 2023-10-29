/**
 * Enforces an invariant in a type-safe way
 * @example
 * ```ts
 * const x: number | undefined = 1
 * invariant(x, 'x should be 1')
 * // x is now narrowed to number
 * ```
 */
export function invariant(condition: any, message: string): asserts condition
