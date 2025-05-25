[**@tevm/utils**](../README.md)

***

[@tevm/utils](../globals.md) / SerializeToJson

# Type Alias: SerializeToJson\<T\>

> **SerializeToJson**\<`T`\> = `T` *extends* [`JsonSerializableSet`](JsonSerializableSet.md)\<infer S\> ? `ReadonlyArray`\<`S`\> : `T` *extends* [`JsonSerializableObject`](JsonSerializableObject.md) ? `{ [P in keyof T]: SerializeToJson<T[P]> }` : `T` *extends* [`JsonSerializableArray`](JsonSerializableArray.md) ? `SerializeToJson`\<`T`\[`number`\]\>[] : [`BigIntToHex`](BigIntToHex.md)\<[`SetToHex`](SetToHex.md)\<`T`\>\>

Defined in: packages/utils/src/SerializeToJson.ts:44

A helper type that converts a widened JSON-serializable value to a JSON-serializable value.
It replaces bigint with hex strings and sets with arrays.

## Type Parameters

### T

`T`
