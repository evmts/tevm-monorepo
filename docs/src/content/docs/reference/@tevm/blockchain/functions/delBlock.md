---
editUrl: false
next: false
prev: false
title: "delBlock"
---

> **delBlock**(`baseChain`): (`blockHash`) => `Promise`\<`void`\>

## Parameters

• **baseChain**: `BaseChain`

## Returns

`Function`

Deletes a block from the blockchain. All child blocks in the chain are
deleted and any encountered heads are set to the parent block.

### Parameters

• **blockHash**: `Uint8Array`

The hash of the block to be deleted

### Returns

`Promise`\<`void`\>

## Source

[actions/delBlock.js:7](https://github.com/evmts/tevm-monorepo/blob/main/packages/blockchain/src/actions/delBlock.js#L7)
