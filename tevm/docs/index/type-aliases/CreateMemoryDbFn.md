[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [index](../README.md) / CreateMemoryDbFn

# Type Alias: CreateMemoryDbFn\<TKey, TValue\>

> **CreateMemoryDbFn**\<`TKey`, `TValue`\> = (`initialDb?`) => [`MemoryDb`](MemoryDb.md)\<`TKey`, `TValue`\>

## Type Parameters

| Type Parameter | Default type |
| ------ | ------ |
| `TKey` *extends* `string` \| `number` \| `Uint8Array` | `Uint8Array` |
| `TValue` *extends* `string` \| `Uint8Array` \| `Uint8Array` \| `string` \| [`DbObject`](../../utils/type-aliases/DbObject.md) | `Uint8Array` |

## Parameters

| Parameter | Type |
| ------ | ------ |
| `initialDb?` | `Map`\<`TKey`, `TValue`\> |

## Returns

[`MemoryDb`](MemoryDb.md)\<`TKey`, `TValue`\>
