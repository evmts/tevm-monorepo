---
editUrl: false
next: false
prev: false
title: "setIteratorHead"
---

> **setIteratorHead**(`baseChain`): (`tag`, `headHash`) => `Promise`\<`void`\>

## Parameters

• **baseChain**: `BaseChain`

## Returns

`Function`

Set header hash of a certain `tag`.
When calling the iterator, the iterator will start running the first child block after the header hash currently stored.

### Parameters

• **tag**: `string`

The tag to save the headHash to

• **headHash**: `Uint8Array`

The head hash to save

### Returns

`Promise`\<`void`\>

## Source

[actions/setIteratorHead.js:7](https://github.com/evmts/tevm-monorepo/blob/main/packages/blockchain/src/actions/setIteratorHead.js#L7)
