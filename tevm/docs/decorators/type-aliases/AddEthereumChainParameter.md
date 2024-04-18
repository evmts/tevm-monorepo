**tevm** • [Readme](../../README.md) \| [API](../../modules.md)

***

[tevm](../../README.md) / [decorators](../README.md) / AddEthereumChainParameter

# Type alias: AddEthereumChainParameter

> **AddEthereumChainParameter**: `object`

## Type declaration

### blockExplorerUrls?

> **`optional`** **blockExplorerUrls**: `string`[]

### chainId

> **chainId**: `string`

A 0x-prefixed hexadecimal string

### chainName

> **chainName**: `string`

The chain name.

### iconUrls?

> **`optional`** **iconUrls**: `string`[]

### nativeCurrency?

> **`optional`** **nativeCurrency**: `object`

Native currency for the chain.

### nativeCurrency.decimals

> **decimals**: `number`

### nativeCurrency.name

> **name**: `string`

### nativeCurrency.symbol

> **symbol**: `string`

### rpcUrls

> **rpcUrls**: readonly `string`[]

## Source

packages/decorators/dist/index.d.ts:223
