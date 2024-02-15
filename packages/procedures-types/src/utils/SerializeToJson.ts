import type { Hex } from '@tevm/utils'

export type JsonSerializable =
	| bigint
	| string
	| number
	| boolean
	| null
	| JsonSerializableArray
	| JsonSerializableObject
	| JsonSerializableSet
export type JsonSerializableArray = ReadonlyArray<JsonSerializable>
export type JsonSerializableObject = { [key: string]: JsonSerializable }
export type JsonSerializableSet<
	T extends bigint | string | number | boolean =
		| bigint
		| string
		| number
		| boolean,
> = Set<T>

export type BigIntToHex<T> = T extends bigint ? Hex : T
export type SetToHex<T> = T extends Set<any> ? Hex : T

export type SerializeToJson<T> = T extends JsonSerializableSet<infer S>
	? ReadonlyArray<S>
	: T extends JsonSerializableObject
	? { [P in keyof T]: SerializeToJson<T[P]> }
	: T extends JsonSerializableArray
	? SerializeToJson<T[number]>[]
	: BigIntToHex<SetToHex<T>>
