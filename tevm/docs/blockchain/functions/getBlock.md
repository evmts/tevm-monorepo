[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [blockchain](../README.md) / getBlock

# Function: getBlock()

> **getBlock**(`baseChain`): (`blockId`) => `Promise`\<[`Block`](../../block/classes/Block.md)\>

Defined in: packages/blockchain/types/actions/getBlock.d.ts:1

## Parameters

### baseChain

`BaseChain`

## Returns

> (`blockId`): `Promise`\<[`Block`](../../block/classes/Block.md)\>

Returns a block by its hash or number.

### Parameters

#### blockId

`number` | `bigint` | `Uint8Array`\<`ArrayBufferLike`\>

### Returns

`Promise`\<[`Block`](../../block/classes/Block.md)\>
