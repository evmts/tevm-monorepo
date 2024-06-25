---
editUrl: false
next: false
prev: false
title: "CreateMemoryDbFn"
---

> **CreateMemoryDbFn**\<`TKey`, `TValue`\>: (`initialDb`?) => [`MemoryDb`](/reference/tevm/utils/type-aliases/memorydb/)\<`TKey`, `TValue`\>

## Type Parameters

• **TKey** *extends* `string` \| `number` \| `Uint8Array` = `Uint8Array`

• **TValue** *extends* `string` \| `Uint8Array` \| `Uint8Array` \| `string` \| [`DbObject`](/reference/tevm/utils/type-aliases/dbobject/) = `Uint8Array`

## Parameters

• **initialDb?**: `Map`\<`TKey`, `TValue`\>

## Returns

[`MemoryDb`](/reference/tevm/utils/type-aliases/memorydb/)\<`TKey`, `TValue`\>

## Defined in

[packages/utils/src/CreateMemoryDbFn.ts:4](https://github.com/evmts/tevm-monorepo/blob/main/packages/utils/src/CreateMemoryDbFn.ts#L4)
