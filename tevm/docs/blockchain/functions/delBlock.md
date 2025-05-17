[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [blockchain](../README.md) / delBlock

# Function: delBlock()

> **delBlock**(`baseChain`): (`blockHash`) => `Promise`\<`void`\>

Defined in: packages/blockchain/types/actions/delBlock.d.ts:1

## Parameters

### baseChain

`BaseChain`

## Returns

> (`blockHash`): `Promise`\<`void`\>

Deletes a block from the blockchain. All child blocks in the chain are
deleted and any encountered heads are set to the parent block.

### Parameters

#### blockHash

`Uint8Array`

The hash of the block to be deleted

### Returns

`Promise`\<`void`\>
