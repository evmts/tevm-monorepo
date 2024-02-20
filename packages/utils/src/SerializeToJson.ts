import type { Hex } from './abitype.js'

/**
 * A type that represents a JSON-serializable value.
 */
export type JsonSerializable =
	| bigint
	| string
	| number
	| boolean
	| null
	| JsonSerializableArray
	| JsonSerializableObject
	| JsonSerializableSet

/**
 * A type that represents a JSON-serializable array.
 */
export type JsonSerializableArray = ReadonlyArray<JsonSerializable>
/**
 * A type that represents a JSON-serializable object.
 */
export type JsonSerializableObject = { [key: string]: JsonSerializable }
/**
 * A type that represents a JSON-serializable set.
 */
export type JsonSerializableSet<
	T extends bigint | string | number | boolean =
		| bigint
		| string
		| number
		| boolean,
> = Set<T>

/**
 * A helper type that converts a bigint to a hex string.
 */
export type BigIntToHex<T> = T extends bigint ? Hex : T
/**
 * A helper type that converts a set to a hex string.
 */
export type SetToHex<T> = T extends Set<any> ? Hex : T

/**
 * A helper type that converts a widened JSON-serializable value to a JSON-serializable value.
 * It replaces bigint with hex strings and sets with arrays.
 */
export type SerializeToJson<T> = T extends JsonSerializableSet<infer S>
	? ReadonlyArray<S>
	: T extends JsonSerializableObject
	? { [P in keyof T]: SerializeToJson<T[P]> }
	: T extends JsonSerializableArray
	? SerializeToJson<T[number]>[]
	: BigIntToHex<SetToHex<T>>
