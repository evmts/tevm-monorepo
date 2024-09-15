---
editUrl: false
next: false
prev: false
title: "getBlockFromRpc"
---

> **getBlockFromRpc**(`baseChain`, `params`, `common`): `Promise`\<[[`Block`](/reference/tevm/block/classes/block/), `RpcBlock`\<[`BlockTag`](/reference/tevm/utils/type-aliases/blocktag/), `true`, `RpcTransaction`\<`boolean`\>\>]\>

## Parameters

• **baseChain**: `BaseChain`

• **params**

• **params.blockTag**: `undefined` \| `bigint` \| [`BlockTag`](/reference/tevm/utils/type-aliases/blocktag/) \| \`0x$\{string\}\` = `'latest'`

• **params.transport**

• **params.transport.request**: `EIP1193RequestFn`\<`undefined`\>

• **common**: [`Common`](/reference/tevm/common/type-aliases/common/)

## Returns

`Promise`\<[[`Block`](/reference/tevm/block/classes/block/), `RpcBlock`\<[`BlockTag`](/reference/tevm/utils/type-aliases/blocktag/), `true`, `RpcTransaction`\<`boolean`\>\>]\>

## Defined in

[utils/getBlockFromRpc.js:16](https://github.com/qbzzt/tevm-monorepo/blob/main/packages/blockchain/src/utils/getBlockFromRpc.js#L16)
