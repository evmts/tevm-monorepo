[**@tevm/blockchain**](../README.md)

***

[@tevm/blockchain](../globals.md) / getBlock

# Function: getBlock()

> **getBlock**(`baseChain`): (`blockId`) => `Promise`\<`Block`\>

Defined in: [packages/blockchain/src/actions/getBlock.js:13](https://github.com/evmts/tevm-monorepo/blob/main/packages/blockchain/src/actions/getBlock.js#L13)

An ethereumjs interface method that accepts a block id number or hash and returns the block

## Parameters

### baseChain

`BaseChain`

## Returns

> (`blockId`): `Promise`\<`Block`\>

Returns a block by its hash or number.

### Parameters

#### blockId

`number` | `bigint` | `Uint8Array`\<`ArrayBufferLike`\>

### Returns

`Promise`\<`Block`\>
