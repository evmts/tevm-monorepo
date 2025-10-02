[**@tevm/common**](../README.md)

***

[@tevm/common](../globals.md) / zora

# Variable: zora

> `const` **zora**: `object`

Defined in: [packages/common/src/presets/zora.js:26](https://github.com/evmts/tevm-monorepo/blob/main/packages/common/src/presets/zora.js#L26)

Creates a common configuration for the zora chain.

## Type Declaration

### blockExplorers?

> `optional` **blockExplorers**: `object`

Collection of block explorers

#### Index Signature

\[`key`: `string`\]: `ChainBlockExplorer`

#### blockExplorers.default

> **default**: `ChainBlockExplorer`

### blockTime?

> `optional` **blockTime**: `number`

Block time in milliseconds.

### contracts?

> `optional` **contracts**: `object`

Collection of contracts

#### Index Signature

\[`key`: `string`\]: `undefined` \| `ChainContract` \| \{\[`sourceId`: `number`\]: `undefined` \| `ChainContract`; \}

#### contracts.ensRegistry?

> `optional` **ensRegistry**: `ChainContract`

#### contracts.ensUniversalResolver?

> `optional` **ensUniversalResolver**: `ChainContract`

#### contracts.erc6492Verifier?

> `optional` **erc6492Verifier**: `ChainContract`

#### contracts.multicall3?

> `optional` **multicall3**: `ChainContract`

### copy()

> **copy**: () => \{ blockExplorers?: \{ \[key: string\]: ChainBlockExplorer; default: ChainBlockExplorer; \} \| undefined; blockTime?: number \| undefined; contracts?: \{ ...; \} \| undefined; ... 13 more ...; copy: () =\> ...; \}

#### Returns

\{ blockExplorers?: \{ \[key: string\]: ChainBlockExplorer; default: ChainBlockExplorer; \} \| undefined; blockTime?: number \| undefined; contracts?: \{ ...; \} \| undefined; ... 13 more ...; copy: () =\> ...; \}

### custom?

> `optional` **custom**: `Record`\<`string`, `unknown`\>

Custom chain data.

### ensTlds?

> `optional` **ensTlds**: readonly `string`[]

Collection of ENS TLDs for the chain.

### ethjsCommon

> **ethjsCommon**: `Common`

### experimental\_preconfirmationTime?

> `optional` **experimental\_preconfirmationTime**: `number`

Preconfirmation time in milliseconds.

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

Chain ID: 7777777
Chain Name: Zora
Default Block Explorer: https://explorer.zora.energy
Default RPC URL: https://rpc.zora.energy

## Example

```ts
import { createMemoryClient } from 'tevm'
import { zora } from 'tevm/common'
import { http } from 'tevm'

const client = createMemoryClient({
  common: zora,
  fork: {
    transport: http({ url: 'https://example.com' })({})
  },
})
```
