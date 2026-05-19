[**@tevm/blockchain**](../README.md)

***

[@tevm/blockchain](../globals.md) / getBlockFromRpc

# Function: getBlockFromRpc()

> **getBlockFromRpc**(`baseChain`, `params`, `common`): `Promise`\<\[`Block`, `RpcBlock`\<`BlockTag`, `true`, `RpcTransaction`\<`boolean`\>\>\]\>

Defined in: [packages/blockchain/src/utils/getBlockFromRpc.js:17](https://github.com/evmts/tevm-monorepo/blob/main/packages/blockchain/src/utils/getBlockFromRpc.js#L17)

## Parameters

### baseChain

`BaseChain`

### params

#### blockTag?

`bigint` \| `BlockTag` \| `` `0x${string}` `` = `'latest'`

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

\{\[`key`: `string`\]: `ChainContract` \| \{\[`sourceId`: `number`\]: `ChainContract` \| `undefined`; \} \| `undefined`; `ensRegistry?`: `ChainContract`; `ensUniversalResolver?`: `ChainContract`; `erc6492Verifier?`: `ChainContract`; `multicall3?`: `ChainContract`; \}

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

() => \{ blockExplorers?: \{ \[key: string\]: ChainBlockExplorer; default: ChainBlockExplorer; \} \| undefined; blockTime?: number \| undefined; contracts?: \{ ...; \} \| undefined; ... 16 more ...; copy: () =\> ...; \}

#### custom?

`Record`\<`string`, `unknown`\>

Custom chain data.

**Deprecated**

use `.extend` instead.

#### ensTlds?

readonly `string`[]

Collection of ENS TLDs for the chain.

#### ethjsCommon

`Common`

#### experimental_preconfirmationTime?

`number`

Preconfirmation time in milliseconds.

#### extendSchema?

`Record`\<`string`, `unknown`\>

Extend schema.

#### fees?

`ChainFees`\<`ChainFormatters` \| `undefined`\>

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

#### prepareTransactionRequest?

`PrepareTransactionRequestFn` \| \[`PrepareTransactionRequestFn`, `object`\]

Function to prepare a transaction request. Runs before the transaction is filled.

#### rpcUrls

\{\[`key`: `string`\]: `ChainRpcUrls`; `default`: `ChainRpcUrls`; \}

Collection of RPC endpoints

#### rpcUrls.default

`ChainRpcUrls`

#### serializers?

`ChainSerializers`\<`ChainFormatters` \| `undefined`, `TransactionSerializable`\>

Modifies how data is serialized (e.g. transactions).

#### sourceId?

`number`

Source Chain ID (ie. the L1 chain)

#### testnet?

`boolean`

Flag for test networks

#### verifyHash?

`ChainVerifyHashFn`

Chain-specific signature verification.

## Returns

`Promise`\<\[`Block`, `RpcBlock`\<`BlockTag`, `true`, `RpcTransaction`\<`boolean`\>\>\]\>
