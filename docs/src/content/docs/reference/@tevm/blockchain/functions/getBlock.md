---
editUrl: false
next: false
prev: false
title: "getBlock"
---

> **getBlock**(`baseChain`): (`blockId`) => `Promise`\<`Block`\>

## Parameters

• **baseChain**: `BaseChain`

## Returns

`Function`

Returns a block by its hash or number.

### Parameters

• **blockId**: `number` \| `bigint` \| `Uint8Array`

### Returns

`Promise`\<`Block`\>

## Source

[actions/getBlock.js:9](https://github.com/evmts/tevm-monorepo/blob/main/packages/blockchain/src/actions/getBlock.js#L9)
