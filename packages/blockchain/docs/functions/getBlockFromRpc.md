[**@tevm/blockchain**](../README.md) • **Docs**

***

[@tevm/blockchain](../globals.md) / getBlockFromRpc

# Function: getBlockFromRpc()

> **getBlockFromRpc**(`baseChain`, `params`, `common`): `Promise`\<`Block`\>

## Parameters

• **baseChain**: `BaseChain`

• **params**

• **params.blockTag**: `undefined` \| `bigint` \| `BlockTag` \| \`0x$\{string\}\` = `'latest'`

• **params.transport**

• **params.transport.request**: `EIP1193RequestFn`\<`undefined`\>

• **common**: `Common`

## Returns

`Promise`\<`Block`\>

## Defined in

[utils/getBlockFromRpc.js:23](https://github.com/evmts/tevm-monorepo/blob/main/packages/blockchain/src/utils/getBlockFromRpc.js#L23)
