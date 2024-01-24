---
editUrl: false
next: false
prev: false
title: "SerializeToJson"
---

> **SerializeToJson**\<`T`\>: `T` extends [`JsonSerializableSet`](/reference/tevm/procedures-types/type-aliases/jsonserializableset/)\<infer S\> ? `ReadonlyArray`\<`S`\> : `T` extends [`JsonSerializableObject`](/reference/tevm/procedures-types/type-aliases/jsonserializableobject/) ? `{ [P in keyof T]: SerializeToJson<T[P]> }` : `T` extends [`JsonSerializableArray`](/reference/tevm/procedures-types/type-aliases/jsonserializablearray/) ? [`SerializeToJson`](/reference/tevm/procedures-types/type-aliases/serializetojson/)\<`T`[`number`]\>[] : [`BigIntToHex`](/reference/tevm/procedures-types/type-aliases/biginttohex/)\<[`SetToHex`](/reference/tevm/procedures-types/type-aliases/settohex/)\<`T`\>\>

## Type parameters

| Parameter |
| :------ |
| `T` |

## Source

[utils/SerializeToJson.ts:25](https://github.com/evmts/tevm-monorepo/blob/main/packages/procedures-types/src/utils/SerializeToJson.ts#L25)

***
Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)
