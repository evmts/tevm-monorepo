**tevm** ∙ [README](../../README.md) ∙ [API](../../API.md)

***

[API](../../API.md) > [utils](../README.md) > SerializeToJson

# Type alias: SerializeToJson`<T>`

> **SerializeToJson**\<`T`\>: `T` extends [`JsonSerializableSet`](JsonSerializableSet.md)\<infer S\> ? `ReadonlyArray`\<`S`\> : `T` extends [`JsonSerializableObject`](JsonSerializableObject.md) ? `{ [P in keyof T]: SerializeToJson<T[P]> }` : `T` extends [`JsonSerializableArray`](JsonSerializableArray.md) ? [`SerializeToJson`](SerializeToJson.md)\<`T`[`number`]\>[] : [`BigIntToHex`](BigIntToHex.md)\<[`SetToHex`](SetToHex.md)\<`T`\>\>

A helper type that converts a widened JSON-serializable value to a JSON-serializable value.
It replaces bigint with hex strings and sets with arrays.

## Type parameters

| Parameter |
| :------ |
| `T` |

## Source

packages/utils/types/SerializeToJson.d.ts:32

***
Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)
