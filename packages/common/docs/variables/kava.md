[**@tevm/common**](../README.md)

***

[@tevm/common](../globals.md) / kava

# Variable: kava

> `const` **kava**: `object`

Defined in: [packages/common/src/presets/kava.js:26](https://github.com/evmts/tevm-monorepo/blob/main/packages/common/src/presets/kava.js#L26)

Creates a common configuration for the kava chain.

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

Chain ID: 2222
Chain Name: Kava EVM
Default Block Explorer: https://kavascan.com
Default RPC URL: https://evm.kava.io

## Example

```ts
import { createMemoryClient } from 'tevm'
import { kava } from 'tevm/common'
import { http } from 'tevm'

const client = createMemoryClient({
  common: kava,
  fork: {
    transport: http({ url: 'https://example.com' })({})
  },
})
```
