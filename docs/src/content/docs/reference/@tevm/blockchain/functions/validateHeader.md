---
editUrl: false
next: false
prev: false
title: "validateHeader"
---

> **validateHeader**(`baseChain`): (`header`, `height`?) => `Promise`\<`void`\>

## Parameters

• **baseChain**: `BaseChain`

## Returns

`Function`

Validates a block header, throwing if invalid. It is being validated against the reported `parentHash`.

### Parameters

• **header**: [`BlockHeader`](/reference/tevm/block/classes/blockheader/)

header to be validated

• **height?**: `bigint`

If this is an uncle header, this is the height of the block that is including it

### Returns

`Promise`\<`void`\>

## Defined in

[actions/validateHeader.js:8](https://github.com/qbzzt/tevm-monorepo/blob/main/packages/blockchain/src/actions/validateHeader.js#L8)
