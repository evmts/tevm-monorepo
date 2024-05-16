[**tevm**](../../README.md) • **Docs**

***

[tevm](../../modules.md) / [index](../README.md) / CreateMemoryDbFn

# Type alias: CreateMemoryDbFn()\<TKey, TValue\>

> **CreateMemoryDbFn**\<`TKey`, `TValue`\>: (`initialDb`?) => [`MemoryDb`](MemoryDb.md)\<`TKey`, `TValue`\>

## Type parameters

• **TKey** *extends* `string` \| `number` \| `Uint8Array` = `Uint8Array`

• **TValue** *extends* `string` \| `Uint8Array` \| `Uint8Array` \| `string` \| [`DbObject`](../../utils/type-aliases/DbObject.md) = `Uint8Array`

## Parameters

• **initialDb?**: `Map`\<`TKey`, `TValue`\>

## Returns

[`MemoryDb`](MemoryDb.md)\<`TKey`, `TValue`\>

## Source

packages/utils/types/CreateMemoryDbFn.d.ts:3
