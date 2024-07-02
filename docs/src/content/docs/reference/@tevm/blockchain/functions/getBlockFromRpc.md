---
editUrl: false
next: false
prev: false
title: "getBlockFromRpc"
---

> **getBlockFromRpc**(`params`, `common`): `Promise`\<[`Block`](/reference/tevm/block/classes/block/)\>

## Parameters

• **params**

• **params.blockTag**: `undefined` \| `bigint` \| [`BlockTag`](/reference/tevm/utils/type-aliases/blocktag/) \| \`0x$\{string\}\` = `'latest'`

• **params.transport**

• **params.transport.request**: `EIP1193RequestFn`\<`undefined`\>

• **common**: [`Common`](/reference/tevm/common/type-aliases/common/)

## Returns

`Promise`\<[`Block`](/reference/tevm/block/classes/block/)\>

## Defined in

[utils/getBlockFromRpc.js:37](https://github.com/evmts/tevm-monorepo/blob/main/packages/blockchain/src/utils/getBlockFromRpc.js#L37)
