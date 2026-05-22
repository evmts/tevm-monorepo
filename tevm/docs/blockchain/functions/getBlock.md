[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [blockchain](../README.md) / getBlock

# Function: getBlock()

> **getBlock**(`baseChain`): (`blockId`) => `Promise`\<[`Block`](../../block/classes/Block.md)\>

## Parameters

| Parameter | Type |
| ------ | ------ |
| `baseChain` | `BaseChain` |

## Returns

> (`blockId`): `Promise`\<[`Block`](../../block/classes/Block.md)\>

Returns a block by its hash or number.

### Parameters

| Parameter | Type |
| ------ | ------ |
| `blockId` | `number` \| `bigint` \| `Uint8Array`\<`ArrayBufferLike`\> |

### Returns

`Promise`\<[`Block`](../../block/classes/Block.md)\>
