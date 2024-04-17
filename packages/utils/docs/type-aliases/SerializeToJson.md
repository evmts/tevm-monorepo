**@tevm/utils** • [Readme](../README.md) \| [API](../globals.md)

***

[@tevm/utils](../README.md) / SerializeToJson

# Type alias: SerializeToJson\<T\>

> **SerializeToJson**\<`T`\>: `T` extends [`JsonSerializableSet`](JsonSerializableSet.md)\<infer S\> ? `ReadonlyArray`\<`S`\> : `T` extends [`JsonSerializableObject`](JsonSerializableObject.md) ? `{ [P in keyof T]: SerializeToJson<T[P]> }` : `T` extends [`JsonSerializableArray`](JsonSerializableArray.md) ? [`SerializeToJson`](SerializeToJson.md)\<`T`\[`number`\]\>[] : [`BigIntToHex`](BigIntToHex.md)\<[`SetToHex`](SetToHex.md)\<`T`\>\>

A helper type that converts a widened JSON-serializable value to a JSON-serializable value.
It replaces bigint with hex strings and sets with arrays.

## Type parameters

• **T**

## Source

[packages/utils/src/SerializeToJson.ts:48](https://github.com/evmts/tevm-monorepo/blob/main/packages/utils/src/SerializeToJson.ts#L48)
