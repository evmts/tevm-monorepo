[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [blockchain](../README.md) / getBlockFromRpc

# Function: getBlockFromRpc()

> **getBlockFromRpc**(`baseChain`, `__namedParameters`, `common`): `Promise`\<\[[`Block`](../../block/classes/Block.md), `RpcBlock`\<[`BlockTag`](../../index/type-aliases/BlockTag.md), `true`, `RpcTransaction`\<`boolean`\>\>\]\>

Defined in: packages/blockchain/types/utils/getBlockFromRpc.d.ts:1

## Parameters

### baseChain

`BaseChain`

### \_\_namedParameters

#### blockTag?

`bigint` \| `` `0x${string}` `` \| [`BlockTag`](../../index/type-aliases/BlockTag.md)

#### transport

\{ `request`: `EIP1193RequestFn`\<`undefined`, `false`\>; \}

#### transport.request

`EIP1193RequestFn`\<`undefined`, `false`\>

### common

#### blockExplorers?

\{\[`key`: `string`\]: `ChainBlockExplorer`; `default`: `ChainBlockExplorer`; \}

Collection of block explorers

#### blockExplorers.default

`ChainBlockExplorer`

#### blockTime?

`number`

Block time in milliseconds.

#### contracts?

\{\[`key`: `string`\]: `undefined` \| `ChainContract` \| \{\[`sourceId`: `number`\]: `undefined` \| `ChainContract`; \}; `ensRegistry?`: `ChainContract`; `ensUniversalResolver?`: `ChainContract`; `erc6492Verifier?`: `ChainContract`; `multicall3?`: `ChainContract`; \}

Collection of contracts

#### contracts.ensRegistry?

`ChainContract`

#### contracts.ensUniversalResolver?

`ChainContract`

#### contracts.erc6492Verifier?

`ChainContract`

#### contracts.multicall3?

`ChainContract`

#### copy

() => \{ blockExplorers?: \{ \[key: string\]: ChainBlockExplorer; default: ChainBlockExplorer; \} \| undefined; blockTime?: number \| undefined; contracts?: \{ ...; \} \| undefined; ... 13 more ...; copy: () =\> ...; \}

#### custom?

`Record`\<`string`, `unknown`\>

Custom chain data.

#### ensTlds?

readonly `string`[]

Collection of ENS TLDs for the chain.

#### ethjsCommon

`Common`

#### experimental_preconfirmationTime?

`number`

Preconfirmation time in milliseconds.

#### fees?

`ChainFees`\<`undefined` \| `ChainFormatters`\>

Modifies how fees are derived.

#### formatters?

`ChainFormatters`

Modifies how data is formatted and typed (e.g. blocks and transactions)

#### id

`number`

ID in number form

#### name

`string`

Human-readable name

#### nativeCurrency

`ChainNativeCurrency`

Currency used by chain

#### rpcUrls

\{\[`key`: `string`\]: `ChainRpcUrls`; `default`: `ChainRpcUrls`; \}

Collection of RPC endpoints

#### rpcUrls.default

`ChainRpcUrls`

#### serializers?

`ChainSerializers`\<`undefined` \| `ChainFormatters`, `TransactionSerializable`\>

Modifies how data is serialized (e.g. transactions).

#### sourceId?

`number`

Source Chain ID (ie. the L1 chain)

#### testnet?

`boolean`

Flag for test networks

## Returns

`Promise`\<\[[`Block`](../../block/classes/Block.md), `RpcBlock`\<[`BlockTag`](../../index/type-aliases/BlockTag.md), `true`, `RpcTransaction`\<`boolean`\>\>\]\>
