[**@tevm/blockchain**](../README.md) • **Docs**

***

[@tevm/blockchain](../globals.md) / getBlock

# Function: getBlock()

> **getBlock**(`baseChain`): (`blockId`) => `Promise`\<`Block`\>

An ethereumjs interface method that accepts a block id number or hash and returns the block

## Parameters

• **baseChain**: `BaseChain`

## Returns

`Function`

Returns a block by its hash or number.

### Parameters

• **blockId**: `number` \| `bigint` \| `Uint8Array`

### Returns

`Promise`\<`Block`\>

## Defined in

[packages/blockchain/src/actions/getBlock.js:13](https://github.com/evmts/tevm-monorepo/blob/main/packages/blockchain/src/actions/getBlock.js#L13)
