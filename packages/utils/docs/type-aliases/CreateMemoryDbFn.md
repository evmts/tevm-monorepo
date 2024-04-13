**@tevm/utils** ∙ [README](../README.md) ∙ [API](../API.md)

***

[API](../API.md) > CreateMemoryDbFn

# Type alias: CreateMemoryDbFn`<TKey, TValue>`

> **CreateMemoryDbFn**\<`TKey`, `TValue`\>: (`initialDb`?) => [`MemoryDb`](MemoryDb.md)\<`TKey`, `TValue`\>

## Type parameters

| Parameter | Default |
| :------ | :------ |
| `TKey` extends `string` \| `number` \| `Uint8Array` | `Uint8Array` |
| `TValue` extends `string` \| `Uint8Array` \| `Uint8Array` \| `string` \| [`DbObject`](DbObject.md) | `Uint8Array` |

## Parameters

▪ **initialDb?**: `Map`\<`TKey`, `TValue`\>

## Source

[packages/utils/src/CreateMemoryDbFn.ts:4](https://github.com/evmts/tevm-monorepo/blob/main/packages/utils/src/CreateMemoryDbFn.ts#L4)

***
Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)
