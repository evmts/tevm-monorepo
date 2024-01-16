import type { Hex } from 'viem'

type JsonSerializable =
	| bigint
	| string
	| number
	| boolean
	| null
	| JsonSerializableArray
	| JsonSerializableObject
	| JsonSerializableSet
type JsonSerializableArray = ReadonlyArray<JsonSerializable>
type JsonSerializableObject = { [key: string]: JsonSerializable }
type JsonSerializableSet<
	T extends bigint | string | number | boolean =
	| bigint
	| string
	| number
	| boolean,
> = Set<T>

type BigIntToHex<T> = Exclude<T, bigint> & (
	bigint extends T ? Hex : T
)

export type SerializeToJson<T> = T extends JsonSerializable
	? (T extends JsonSerializableSet<infer S>
		? ReadonlyArray<S>
		: T extends JsonSerializableArray
		? SerializeToJson<T[number]>[]
		: T extends JsonSerializableObject
		? { [P in keyof T]: SerializeToJson<T[P]> }
		: BigIntToHex<T>)
	: never
