---
editUrl: false
next: false
prev: false
title: "CreateMemoryDbFn"
---

> **CreateMemoryDbFn**\<`TKey`, `TValue`\>: (`initialDb`?) => [`MemoryDb`](/reference/tevm/utils/type-aliases/memorydb/)\<`TKey`, `TValue`\>

## Type parameters

| Parameter | Default |
| :------ | :------ |
| `TKey` extends `string` \| `number` \| `Uint8Array` | `Uint8Array` |
| `TValue` extends `string` \| `Uint8Array` \| `Uint8Array` \| `string` \| `DBObject` | `Uint8Array` |

## Parameters

▪ **initialDb?**: `Map`\<`TKey`, `TValue`\>

## Source

[packages/utils/src/CreateMemoryDbFn.ts:4](https://github.com/evmts/tevm-monorepo/blob/main/packages/utils/src/CreateMemoryDbFn.ts#L4)

***
Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)
