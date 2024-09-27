---
editUrl: false
next: false
prev: false
title: "getBlock"
---

> **getBlock**(`baseChain`): (`blockId`) => `Promise`\<[`Block`](/reference/tevm/block/classes/block/)\>

An ethereumjs interface method that accepts a block id number or hash and returns the block

## Parameters

• **baseChain**: `BaseChain`

## Returns

`Function`

Returns a block by its hash or number.

### Parameters

• **blockId**: `number` \| `bigint` \| `Uint8Array`

### Returns

`Promise`\<[`Block`](/reference/tevm/block/classes/block/)\>

## Defined in

[packages/blockchain/src/actions/getBlock.js:13](https://github.com/evmts/tevm-monorepo/blob/main/packages/blockchain/src/actions/getBlock.js#L13)
