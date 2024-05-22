[**tevm**](../../README.md) • **Docs**

***

[tevm](../../modules.md) / [chains](../README.md) / sepolia

# Variable: sepolia

> `const` **sepolia**: [`TevmChainCommon`](../type-aliases/TevmChainCommon.md)\<`object`\>

## Type declaration

### blockExplorers

> **blockExplorers**: `object`

### blockExplorers.default

> `readonly` **default**: `object`

### blockExplorers.default.apiUrl

> `readonly` **apiUrl**: `"https://api-sepolia.etherscan.io/api"`

### blockExplorers.default.name

> `readonly` **name**: `"Etherscan"`

### blockExplorers.default.url

> `readonly` **url**: `"https://sepolia.etherscan.io"`

### contracts

> **contracts**: `object`

### contracts.ensRegistry

> `readonly` **ensRegistry**: `object`

### contracts.ensRegistry.address

> `readonly` **address**: `"0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e"`

### contracts.ensUniversalResolver

> `readonly` **ensUniversalResolver**: `object`

### contracts.ensUniversalResolver.address

> `readonly` **address**: `"0xc8Af999e38273D658BE1b921b88A9Ddf005769cC"`

### contracts.ensUniversalResolver.blockCreated

> `readonly` **blockCreated**: `5317080`

### contracts.multicall3

> `readonly` **multicall3**: `object`

### contracts.multicall3.address

> `readonly` **address**: `"0xca11bde05977b3631167028862be2a173976ca11"`

### contracts.multicall3.blockCreated

> `readonly` **blockCreated**: `751532`

### custom?

> `optional` **custom**: `Record`\<`string`, `unknown`\>

### fees?

> `optional` **fees**: `ChainFees`

### formatters?

> `optional` **formatters**: `undefined`

### id

> **id**: `11155111`

### name

> **name**: `"Sepolia"`

### nativeCurrency

> **nativeCurrency**: `object`

### nativeCurrency.decimals

> `readonly` **decimals**: `18`

### nativeCurrency.name

> `readonly` **name**: `"Sepolia Ether"`

### nativeCurrency.symbol

> `readonly` **symbol**: `"ETH"`

### rpcUrls

> **rpcUrls**: `object`

### rpcUrls.default

> `readonly` **default**: `object`

### rpcUrls.default.http

> `readonly` **http**: readonly [`"https://rpc.sepolia.org"`]

### serializers?

> `optional` **serializers**: `ChainSerializers`

### sourceId?

> `optional` **sourceId**: `number`

### testnet

> **testnet**: `true`

## Source

packages/chains/types/index.d.ts:1132
