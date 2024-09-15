[**@tevm/memory-client**](../README.md) • **Docs**

***

[@tevm/memory-client](../globals.md) / tevmMine

# Function: tevmMine()

> **tevmMine**(`client`, `params`?): `Promise`\<`MineResult`\>

## Parameters

• **client**: `Client`\<[`TevmTransport`](../type-aliases/TevmTransport.md)\<`string`\>, `undefined` \| `Chain`, `undefined` \| `Account`, `undefined`, `undefined` \| `object`\>

The viem client configured with TEVM transport.

• **params?**: `MineParams`\<`boolean`\>

Optional parameters for mining blocks.

## Returns

`Promise`\<`MineResult`\>

The result of mining blocks, including an array of block hashes.

## Defined in

[packages/memory-client/src/tevmMine.js:49](https://github.com/qbzzt/tevm-monorepo/blob/main/packages/memory-client/src/tevmMine.js#L49)
