[**@tevm/common**](../README.md)

***

[@tevm/common](../globals.md) / dchainTestnet

# Variable: dchainTestnet

> `const` **dchainTestnet**: `object`

Defined in: [packages/common/src/presets/dchainTestnet.js:26](https://github.com/evmts/tevm-monorepo/blob/main/packages/common/src/presets/dchainTestnet.js#L26)

Creates a common configuration for the dchainTestnet chain.

## Type declaration

### blockExplorers?

> `optional` **blockExplorers**: `object`

Collection of block explorers

#### Index Signature

\[`key`: `string`\]: `ChainBlockExplorer`

#### blockExplorers.default

> **default**: `ChainBlockExplorer`

### contracts?

> `optional` **contracts**: `object`

Collection of contracts

#### Index Signature

\[`key`: `string`\]: `undefined` \| `ChainContract` \| \{\}

#### contracts.ensRegistry?

> `optional` **ensRegistry**: `ChainContract`

#### contracts.ensUniversalResolver?

> `optional` **ensUniversalResolver**: `ChainContract`

#### contracts.multicall3?

> `optional` **multicall3**: `ChainContract`

#### contracts.universalSignatureVerifier?

> `optional` **universalSignatureVerifier**: `ChainContract`

### copy()

> **copy**: () => \{ blockExplorers?: \{ \[key: string\]: ChainBlockExplorer; default: ChainBlockExplorer; \} \| undefined; contracts?: \{ \[x: string\]: ChainContract \| \{ ...; \} \| undefined; ensRegistry?: ChainContract \| undefined; ensUniversalResolver?: ChainContract \| undefined; multicall3?: ChainContract \| undefined; universalSignatureVer...

#### Returns

\{ blockExplorers?: \{ \[key: string\]: ChainBlockExplorer; default: ChainBlockExplorer; \} \| undefined; contracts?: \{ \[x: string\]: ChainContract \| \{ ...; \} \| undefined; ensRegistry?: ChainContract \| undefined; ensUniversalResolver?: ChainContract \| undefined; multicall3?: ChainContract \| undefined; universalSignatureVer...

### custom?

> `optional` **custom**: `Record`\<`string`, `unknown`\>

Custom chain data.

### ethjsCommon

> **ethjsCommon**: `Common`

### fees?

> `optional` **fees**: `ChainFees`\<`undefined` \| `ChainFormatters`\>

Modifies how fees are derived.

### formatters?

> `optional` **formatters**: `ChainFormatters`

Modifies how data is formatted and typed (e.g. blocks and transactions)

### id

> **id**: `number`

ID in number form

### name

> **name**: `string`

Human-readable name

### nativeCurrency

> **nativeCurrency**: `ChainNativeCurrency`

Currency used by chain

### rpcUrls

> **rpcUrls**: `object`

Collection of RPC endpoints

#### Index Signature

\[`key`: `string`\]: `ChainRpcUrls`

#### rpcUrls.default

> **default**: `ChainRpcUrls`

### serializers?

> `optional` **serializers**: `ChainSerializers`\<`undefined` \| `ChainFormatters`, `TransactionSerializable`\>

Modifies how data is serialized (e.g. transactions).

### sourceId?

> `optional` **sourceId**: `number`

Source Chain ID (ie. the L1 chain)

### testnet?

> `optional` **testnet**: `boolean`

Flag for test networks

## Description

Chain ID: 2713017997578000
Chain Name: Dchain Testnet
Default Block Explorer: https://dchaintestnet-2713017997578000-1.testnet.sagaexplorer.io
Default RPC URL: https://dchaintestnet-2713017997578000-1.jsonrpc.testnet.sagarpc.io

## Example

```ts
import { createMemoryClient } from 'tevm'
import { dchainTestnet } from 'tevm/common'
import { http } from 'tevm'

const client = createMemoryClient({
  common: dchainTestnet,
  fork: {
    transport: http({ url: 'https://example.com' })({})
  },
})
```
