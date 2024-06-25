[**tevm**](../../README.md) • **Docs**

***

[tevm](../../modules.md) / [procedures](../README.md) / SerializeToJson

# Type Alias: SerializeToJson\<T\>

> **SerializeToJson**\<`T`\>: `T` *extends* `Error` & `object` ? `object` : `T` *extends* [`JsonSerializableSet`](JsonSerializableSet.md)\<infer S\> ? `ReadonlyArray`\<`S`\> : `T` *extends* [`JsonSerializableObject`](JsonSerializableObject.md) ? `{ [P in keyof T]: SerializeToJson<T[P]> }` : `T` *extends* [`JsonSerializableArray`](JsonSerializableArray.md) ? [`SerializeToJson`](SerializeToJson.md)\<`T`\[`number`\]\>[] : [`BigIntToHex`](BigIntToHex.md)\<[`SetToHex`](SetToHex.md)\<`T`\>\>

## Type Parameters

• **T**

## Defined in

packages/procedures/dist/index.d.ts:21
