[**tevm**](../../README.md) • **Docs**

***

[tevm](../../modules.md) / [chains](../README.md) / ViemChain

# Type alias: ViemChain\<formatters, custom\>

> **ViemChain**\<`formatters`, `custom`\>: `object`

## Type parameters

• **formatters** *extends* `ChainFormatters` \| `undefined` = `ChainFormatters` \| `undefined`

• **custom** *extends* `Record`\<`string`, `unknown`\> \| `undefined` = `Record`\<`string`, `unknown`\> \| `undefined`

## Type declaration

### blockExplorers?

> `optional` **blockExplorers**: `object`

Collection of block explorers

#### Index signature

 \[`key`: `string`\]: `ChainBlockExplorer`

### blockExplorers.default

> **default**: `ChainBlockExplorer`

### contracts?

> `optional` **contracts**: `Prettify`\<`object` & `object`\>

Collection of contracts

### custom?

> `optional` **custom**: `custom`

Custom chain data.

### fees?

> `optional` **fees**: `ChainFees`\<`formatters` \| `undefined`\>

Modifies how fees are derived.

### formatters?

> `optional` **formatters**: `formatters`

Modifies how chain data structures (ie. Blocks, Transactions, etc)
are formatted & typed.

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

#### Index signature

 \[`key`: `string`\]: `ChainRpcUrls`

### rpcUrls.default

> **default**: `ChainRpcUrls`

### serializers?

> `optional` **serializers**: `ChainSerializers`\<`formatters`\>

Modifies how data (ie. Transactions) is serialized.

### sourceId?

> `optional` **sourceId**: `number`

Source Chain ID (ie. the L1 chain)

### testnet?

> `optional` **testnet**: `boolean`

Flag for test networks

## Source

node\_modules/.pnpm/viem@2.11.1\_typescript@5.4.5\_zod@3.23.8/node\_modules/viem/\_types/types/chain.d.ts:12
