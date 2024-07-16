[**@tevm/blockchain**](../README.md) • **Docs**

***

[@tevm/blockchain](../globals.md) / getBlockFromRpc

# Function: getBlockFromRpc()

> **getBlockFromRpc**(`baseChain`, `params`, `common`): `Promise`\<[`Block`, `RpcBlock`\<`BlockTag`, `true`, `RpcTransaction`\<`boolean`\>\>]\>

## Parameters

• **baseChain**: `BaseChain`

• **params**

• **params.blockTag**: `undefined` \| `bigint` \| `BlockTag` \| \`0x$\{string\}\` = `'latest'`

• **params.transport**

• **params.transport.request**: `EIP1193RequestFn`\<`undefined`\>

• **common**: `Common`

## Returns

`Promise`\<[`Block`, `RpcBlock`\<`BlockTag`, `true`, `RpcTransaction`\<`boolean`\>\>]\>

## Defined in

[utils/getBlockFromRpc.js:16](https://github.com/evmts/tevm-monorepo/blob/main/packages/blockchain/src/utils/getBlockFromRpc.js#L16)
