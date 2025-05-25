[**@tevm/blockchain**](../README.md)

***

[@tevm/blockchain](../globals.md) / delBlock

# Function: delBlock()

> **delBlock**(`baseChain`): (`blockHash`) => `Promise`\<`void`\>

Defined in: packages/blockchain/src/actions/delBlock.js:12

Deletes a block from the blockchain

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

## Throws

If the block is the `forked` block
