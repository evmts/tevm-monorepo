[**@tevm/procedures**](../README.md) • **Docs**

***

[@tevm/procedures](../globals.md) / SerializeToJson

# Type Alias: SerializeToJson\<T\>

> **SerializeToJson**\<`T`\>: `T` *extends* `Error` & `object` ? `object` : `T` *extends* [`JsonSerializableSet`](JsonSerializableSet.md)\<infer S\> ? `ReadonlyArray`\<`S`\> : `T` *extends* [`JsonSerializableObject`](JsonSerializableObject.md) ? `{ [P in keyof T]: SerializeToJson<T[P]> }` : `T` *extends* [`JsonSerializableArray`](JsonSerializableArray.md) ? [`SerializeToJson`](SerializeToJson.md)\<`T`\[`number`\]\>[] : [`BigIntToHex`](BigIntToHex.md)\<[`SetToHex`](SetToHex.md)\<`T`\>\>

## Type Parameters

• **T**

## Defined in

[packages/procedures/src/utils/SerializeToJson.ts:22](https://github.com/qbzzt/tevm-monorepo/blob/main/packages/procedures/src/utils/SerializeToJson.ts#L22)
