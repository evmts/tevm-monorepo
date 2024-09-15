---
editUrl: false
next: false
prev: false
title: "tevmMine"
---

> **tevmMine**(`client`, `params`?): `Promise`\<[`MineResult`](/reference/tevm/actions/type-aliases/mineresult/)\>

## Parameters

• **client**: `Client`\<[`TevmTransport`](/reference/tevm/memory-client/type-aliases/tevmtransport/)\<`string`\>, `undefined` \| `Chain`, `undefined` \| [`Account`](/reference/tevm/utils/type-aliases/account/), `undefined`, `undefined` \| `object`\>

The viem client configured with TEVM transport.

• **params?**: [`MineParams`](/reference/tevm/actions/type-aliases/mineparams/)\<`boolean`\>

Optional parameters for mining blocks.

## Returns

`Promise`\<[`MineResult`](/reference/tevm/actions/type-aliases/mineresult/)\>

The result of mining blocks, including an array of block hashes.

## Defined in

[packages/memory-client/src/tevmMine.js:49](https://github.com/qbzzt/tevm-monorepo/blob/main/packages/memory-client/src/tevmMine.js#L49)
