import type { Hex } from "viem";

type JsonSerializable = bigint | string | number | boolean | null | JsonSerializableArray | JsonSerializableObject | JsonSerializableSet;
interface JsonSerializableArray extends ReadonlyArray<JsonSerializable> { }
type JsonSerializableObject = { [key: string]: JsonSerializable };
type JsonSerializableSet<T extends bigint | string | number | boolean = bigint | string | number | boolean> = Set<T>;

type BigIntToHex<T> = T extends bigint ? Hex : T;
type SetToHex<T> = T extends Set<any> ? Hex : T;

export type SerializeToJson<T> =
  T extends JsonSerializableSet<infer S> ? ReadonlyArray<S> :
  T extends JsonSerializableObject ? { [P in keyof T]: SerializeToJson<T[P]> } :
  T extends JsonSerializableArray ? SerializeToJson<T[number]>[] :
  BigIntToHex<SetToHex<T>>;
