**tevm** ∙ [README](../../README.md) ∙ [API](../../API.md)

***

[API](../../API.md) > [index](../README.md) > CreateMemoryDbFn

# Type alias: CreateMemoryDbFn`<TKey, TValue>`

> **CreateMemoryDbFn**\<`TKey`, `TValue`\>: (`initialDb`?) => [`MemoryDb`](MemoryDb.md)\<`TKey`, `TValue`\>

## Type parameters

| Parameter | Default |
| :------ | :------ |
| `TKey` extends `string` \| `number` \| `Uint8Array` | `Uint8Array` |
| `TValue` extends `string` \| `Uint8Array` \| `Uint8Array` \| `string` \| [`DbObject`](../../utils/type-aliases/DbObject.md) | `Uint8Array` |

## Parameters

▪ **initialDb?**: `Map`\<`TKey`, `TValue`\>

## Source

packages/utils/types/CreateMemoryDbFn.d.ts:3

***
Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)
