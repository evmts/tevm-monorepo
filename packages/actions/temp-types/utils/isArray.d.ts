/**
 * Type guard to check if a value is an array of type T or a single value of type T
 * @template T
 * @param {T | T[] | readonly T[]} value
 * @returns {value is T[] | readonly T[]}
 */
export function isArray<T>(value: T | T[] | readonly T[]): value is T[] | readonly T[];
//# sourceMappingURL=isArray.d.ts.map