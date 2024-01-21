/**
 * An error with a tag
 */
export type TypedError<T> = Error & { tag: T }
