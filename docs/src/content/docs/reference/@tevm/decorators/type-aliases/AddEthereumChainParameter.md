---
editUrl: false
next: false
prev: false
title: "AddEthereumChainParameter"
---

> **AddEthereumChainParameter**: `object`

## Type declaration

### blockExplorerUrls?

> `optional` **blockExplorerUrls**: `string`[]

### chainId

> **chainId**: `string`

A 0x-prefixed hexadecimal string

### chainName

> **chainName**: `string`

The chain name.

### iconUrls?

> `optional` **iconUrls**: `string`[]

### nativeCurrency?

> `optional` **nativeCurrency**: `object`

Native currency for the chain.

### nativeCurrency.decimals

> **nativeCurrency.decimals**: `number`

### nativeCurrency.name

> **nativeCurrency.name**: `string`

### nativeCurrency.symbol

> **nativeCurrency.symbol**: `string`

### rpcUrls

> **rpcUrls**: readonly `string`[]

## Defined in

[eip1193/AddEthereumChainParameter.ts:7](https://github.com/evmts/tevm-monorepo/blob/main/packages/decorators/src/eip1193/AddEthereumChainParameter.ts#L7)
