[**@tevm/common**](../README.md) • **Docs**

***

[@tevm/common](../globals.md) / mandala

# Variable: mandala

> `const` **mandala**: `object`

Creates a common configuration for the mandala chain.

## Description

Chain ID: 595
Chain Name: Mandala TC9
Default Block Explorer: https://blockscout.mandala.aca-staging.network
Default RPC URL: https://eth-rpc-tc9.aca-staging.network

## Example

```ts
import { createMemoryClient } from 'tevm'
import { mandala } from 'tevm/common'
import { http } from 'tevm'

const client = createMemoryClient({
  common: mandala,
  fork: {
    transport: http({ url: 'https://example.com' })({})
  },
})
```

## Type declaration

### blockExplorers?

> `optional` **blockExplorers**: `object`

Collection of block explorers

#### Index Signature

 \[`key`: `string`\]: `ChainBlockExplorer`

### blockExplorers.default

> **default**: `ChainBlockExplorer`

### contracts?

> `optional` **contracts**: `object`

Collection of contracts

### contracts.ensRegistry?

> `optional` **ensRegistry**: `ChainContract`

### contracts.ensUniversalResolver?

> `optional` **ensUniversalResolver**: `ChainContract`

### contracts.multicall3?

> `optional` **multicall3**: `ChainContract`

### copy()

> **copy**: () => \{ blockExplorers?: \{ \[key: string\]: ChainBlockExplorer; default: ChainBlockExplorer; \} \| undefined; contracts?: \{ \[x: string\]: ChainContract \| \{ ...; \} \| undefined; ensRegistry?: ChainContract \| undefined; ensUniversalResolver?: ChainContract \| undefined; multicall3?: ChainContract \| undefined; \} \| undefined; ... 11...

#### Returns

\{ blockExplorers?: \{ \[key: string\]: ChainBlockExplorer; default: ChainBlockExplorer; \} \| undefined; contracts?: \{ \[x: string\]: ChainContract \| \{ ...; \} \| undefined; ensRegistry?: ChainContract \| undefined; ensUniversalResolver?: ChainContract \| undefined; multicall3?: ChainContract \| undefined; \} \| undefined; ... 11...

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

### rpcUrls.default

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

## Defined in

[packages/common/src/presets/mandala.js:26](https://github.com/evmts/tevm-monorepo/blob/main/packages/common/src/presets/mandala.js#L26)