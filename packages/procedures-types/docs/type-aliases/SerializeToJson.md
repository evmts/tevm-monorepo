**@tevm/procedures-types** • [Readme](../README.md) \| [API](../globals.md)

***

[@tevm/procedures-types](../README.md) / SerializeToJson

# Type alias: SerializeToJson\<T\>

> **SerializeToJson**\<`T`\>: `T` extends [`JsonSerializableSet`](JsonSerializableSet.md)\<infer S\> ? `ReadonlyArray`\<`S`\> : `T` extends [`JsonSerializableObject`](JsonSerializableObject.md) ? `{ [P in keyof T]: SerializeToJson<T[P]> }` : `T` extends [`JsonSerializableArray`](JsonSerializableArray.md) ? [`SerializeToJson`](SerializeToJson.md)\<`T`\[`number`\]\>[] : [`BigIntToHex`](BigIntToHex.md)\<[`SetToHex`](SetToHex.md)\<`T`\>\>

## Type parameters

• **T**

## Source

[utils/SerializeToJson.ts:25](https://github.com/evmts/tevm-monorepo/blob/main/packages/procedures-types/src/utils/SerializeToJson.ts#L25)
