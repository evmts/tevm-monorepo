---
editUrl: false
next: false
prev: false
title: "SerializeToJson"
---

> **SerializeToJson**\<`T`\>: `T` *extends* `Error` & `object` ? `object` : `T` *extends* [`JsonSerializableSet`](/reference/tevm/procedures/type-aliases/jsonserializableset/)\<infer S\> ? `ReadonlyArray`\<`S`\> : `T` *extends* [`JsonSerializableObject`](/reference/tevm/procedures/type-aliases/jsonserializableobject/) ? `{ [P in keyof T]: SerializeToJson<T[P]> }` : `T` *extends* [`JsonSerializableArray`](/reference/tevm/procedures/type-aliases/jsonserializablearray/) ? [`SerializeToJson`](/reference/tevm/procedures/type-aliases/serializetojson/)\<`T`\[`number`\]\>[] : [`BigIntToHex`](/reference/tevm/procedures/type-aliases/biginttohex/)\<[`SetToHex`](/reference/tevm/procedures/type-aliases/settohex/)\<`T`\>\>

## Type Parameters

• **T**

## Defined in

[packages/procedures/src/utils/SerializeToJson.ts:22](https://github.com/evmts/tevm-monorepo/blob/main/packages/procedures/src/utils/SerializeToJson.ts#L22)
