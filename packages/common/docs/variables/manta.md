[**@tevm/common**](../README.md)

***

[@tevm/common](../globals.md) / manta

# Variable: manta

> `const` **manta**: `object`

Defined in: [packages/common/src/presets/manta.js:26](https://github.com/evmts/tevm-monorepo/blob/main/packages/common/src/presets/manta.js#L26)

Creates a common configuration for the manta chain.

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

\[`key`: `string`\]: `undefined` \| `ChainContract` \| \{[`sourceId`: `number`]: `undefined` \| `ChainContract`; \}

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

### ensTlds?

> `optional` **ensTlds**: readonly `string`[]

Collection of ENS TLDs for the chain.

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

Chain ID: 169
Chain Name: Manta Pacific Mainnet
Default Block Explorer: https://pacific-explorer.manta.network
Default RPC URL: https://pacific-rpc.manta.network/http

## Example

```ts
import { createMemoryClient } from 'tevm'
import { manta } from 'tevm/common'
import { http } from 'tevm'

const client = createMemoryClient({
  common: manta,
  fork: {
    transport: http({ url: 'https://example.com' })({})
  },
})
```
