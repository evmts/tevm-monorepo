---
editUrl: false
next: false
prev: false
title: "SerializeToJson"
---

> **SerializeToJson**\<`T`\>: `T` *extends* [`JsonSerializableSet`](/reference/tevm/utils/type-aliases/jsonserializableset/)\<infer S\> ? `ReadonlyArray`\<`S`\> : `T` *extends* [`JsonSerializableObject`](/reference/tevm/utils/type-aliases/jsonserializableobject/) ? `{ [P in keyof T]: SerializeToJson<T[P]> }` : `T` *extends* [`JsonSerializableArray`](/reference/tevm/utils/type-aliases/jsonserializablearray/) ? [`SerializeToJson`](/reference/tevm/utils/type-aliases/serializetojson/)\<`T`\[`number`\]\>[] : [`BigIntToHex`](/reference/tevm/utils/type-aliases/biginttohex/)\<[`SetToHex`](/reference/tevm/utils/type-aliases/settohex/)\<`T`\>\>

A helper type that converts a widened JSON-serializable value to a JSON-serializable value.
It replaces bigint with hex strings and sets with arrays.

## Type parameters

• **T**

## Source

[packages/utils/src/SerializeToJson.ts:43](https://github.com/evmts/tevm-monorepo/blob/main/packages/utils/src/SerializeToJson.ts#L43)
