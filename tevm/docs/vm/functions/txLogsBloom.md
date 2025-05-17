[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [vm](../README.md) / txLogsBloom

# Function: txLogsBloom()

> **txLogsBloom**(`logs`, `common`): `Bloom`

Defined in: packages/vm/types/actions/txLogsBloom.d.ts:9

**`Internal`**

Creates a bloom filter from the logs.

## Parameters

### logs

The logs to create the bloom filter from.

`undefined` | `any`[]

### common

The common object.')}

#### blockExplorers?

\{[`key`: `string`]: `ChainBlockExplorer`; `default`: `ChainBlockExplorer`; \}

Collection of block explorers

#### blockExplorers.default

`ChainBlockExplorer`

#### contracts?

\{[`key`: `string`]: `undefined` \| `ChainContract` \| \{[`sourceId`: `number`]: `undefined` \| `ChainContract`; \}; `ensRegistry?`: `ChainContract`; `ensUniversalResolver?`: `ChainContract`; `multicall3?`: `ChainContract`; `universalSignatureVerifier?`: `ChainContract`; \}

Collection of contracts

#### contracts.ensRegistry?

`ChainContract`

#### contracts.ensUniversalResolver?

`ChainContract`

#### contracts.multicall3?

`ChainContract`

#### contracts.universalSignatureVerifier?

`ChainContract`

#### copy

() => \{ blockExplorers?: \{ \[key: string\]: ChainBlockExplorer; default: ChainBlockExplorer; \} \| undefined; contracts?: \{ \[x: string\]: ChainContract \| \{ ...; \} \| undefined; ensRegistry?: ChainContract \| undefined; ensUniversalResolver?: ChainContract \| undefined; multicall3?: ChainContract \| undefined; universalSignatureVer...

#### custom?

`Record`\<`string`, `unknown`\>

Custom chain data.

#### ethjsCommon

`Common`

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

\{[`key`: `string`]: `ChainRpcUrls`; `default`: `ChainRpcUrls`; \}

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

`Bloom`

## Throws
