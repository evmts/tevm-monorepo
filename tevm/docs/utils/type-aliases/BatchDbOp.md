[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [utils](../README.md) / BatchDbOp

# Type Alias: BatchDbOp\<TKey, TValue\>

> **BatchDbOp**\<`TKey`, `TValue`\> = `PutBatch`\<`TKey`, `TValue`\> \| `DelBatch`\<`TKey`\>

## Type Parameters

| Type Parameter | Default type |
| ------ | ------ |
| `TKey` *extends* `Uint8Array` \| `string` \| `number` | `Uint8Array` |
| `TValue` *extends* `Uint8Array` \| `string` \| [`DbObject`](DbObject.md) | `Uint8Array` |
