[**tevm**](../../README.md) • **Docs**

***

[tevm](../../modules.md) / [blockchain](../README.md) / getBlockFromRpc

# Function: getBlockFromRpc()

> **getBlockFromRpc**(`baseChain`, `__namedParameters`, `common`): `Promise`\<[[`Block`](../../block/classes/Block.md), `RpcBlock`]\>

## Parameters

• **baseChain**: `BaseChain`

• **\_\_namedParameters**

• **\_\_namedParameters.blockTag?**: `bigint` \| \`0x$\{string\}\` \| [`BlockTag`](../../index/type-aliases/BlockTag.md)

• **\_\_namedParameters.transport**

• **\_\_namedParameters.transport.request**: `EIP1193RequestFn`\<`undefined`\>

• **common**: [`Common`](../../common/type-aliases/Common.md)

## Returns

`Promise`\<[[`Block`](../../block/classes/Block.md), `RpcBlock`]\>

## Defined in

packages/blockchain/types/utils/getBlockFromRpc.d.ts:1
