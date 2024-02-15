**tevm** ∙ [README](../../README.md) ∙ [API](../../API.md)

***

[API](../../API.md) > [procedures-types](../README.md) > SerializeToJson

# Type alias: SerializeToJson`<T>`

> **SerializeToJson**\<`T`\>: `T` extends [`JsonSerializableSet`](JsonSerializableSet.md)\<infer S\> ? `ReadonlyArray`\<`S`\> : `T` extends [`JsonSerializableObject`](JsonSerializableObject.md) ? `{ [P in keyof T]: SerializeToJson<T[P]> }` : `T` extends [`JsonSerializableArray`](JsonSerializableArray.md) ? [`SerializeToJson`](SerializeToJson.md)\<`T`[`number`]\>[] : [`BigIntToHex`](BigIntToHex.md)\<[`SetToHex`](SetToHex.md)\<`T`\>\>

## Type parameters

| Parameter |
| :------ |
| `T` |

## Source

packages/procedures-types/dist/index.d.ts:15

***
Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)
