[**tevm**](../../README.md) • **Docs**

***

[tevm](../../modules.md) / [procedures-types](../README.md) / SerializeToJson

# Type alias: SerializeToJson\<T\>

> **SerializeToJson**\<`T`\>: `T` *extends* [`JsonSerializableSet`](JsonSerializableSet.md)\<infer S\> ? `ReadonlyArray`\<`S`\> : `T` *extends* [`JsonSerializableObject`](JsonSerializableObject.md) ? `{ [P in keyof T]: SerializeToJson<T[P]> }` : `T` *extends* [`JsonSerializableArray`](JsonSerializableArray.md) ? [`SerializeToJson`](SerializeToJson.md)\<`T`\[`number`\]\>[] : [`BigIntToHex`](BigIntToHex.md)\<[`SetToHex`](SetToHex.md)\<`T`\>\>

## Type parameters

• **T**

## Source

packages/procedures-types/dist/index.d.ts:15
