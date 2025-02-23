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

• **common**

• **common.blockExplorers?**

Collection of block explorers

• **common.blockExplorers.default**: `ChainBlockExplorer`

• **common.contracts?**

Collection of contracts

• **common.contracts.ensRegistry?**: `ChainContract`

• **common.contracts.ensUniversalResolver?**: `ChainContract`

• **common.contracts.multicall3?**: `ChainContract`

• **common.copy**

• **common.custom?**: `Record`\<`string`, `unknown`\>

Custom chain data.

• **common.ethjsCommon**: `Common`

• **common.fees?**: `ChainFees`\<`undefined` \| `ChainFormatters`\>

Modifies how fees are derived.

• **common.formatters?**: `ChainFormatters`

Modifies how data is formatted and typed (e.g. blocks and transactions)

• **common.id**: `number`

ID in number form

• **common.name**: `string`

Human-readable name

• **common.nativeCurrency**: `ChainNativeCurrency`

Currency used by chain

• **common.rpcUrls**

Collection of RPC endpoints

• **common.rpcUrls.default**: `ChainRpcUrls`

• **common.serializers?**: `ChainSerializers`\<`undefined` \| `ChainFormatters`, `TransactionSerializable`\>

Modifies how data is serialized (e.g. transactions).

• **common.sourceId?**: `number`

Source Chain ID (ie. the L1 chain)

• **common.testnet?**: `boolean`

Flag for test networks

## Returns

`Promise`\<[`Block`, `RpcBlock`\<`BlockTag`, `true`, `RpcTransaction`\<`boolean`\>\>]\>

## Defined in

[packages/blockchain/src/utils/getBlockFromRpc.js:17](https://github.com/evmts/tevm-monorepo/blob/main/packages/blockchain/src/utils/getBlockFromRpc.js#L17)
