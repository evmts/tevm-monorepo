---
editUrl: false
next: false
prev: false
title: "AddEthereumChainParameter"
---

> **AddEthereumChainParameter**: `object`

## Type declaration

### blockExplorerUrls

> **blockExplorerUrls**?: `string`[]

### chainId

> **chainId**: `string`

A 0x-prefixed hexadecimal string

### chainName

> **chainName**: `string`

The chain name.

### iconUrls

> **iconUrls**?: `string`[]

### nativeCurrency

> **nativeCurrency**?: `object`

Native currency for the chain.

### nativeCurrency.decimals

> **nativeCurrency.decimals**: `number`

### nativeCurrency.name

> **nativeCurrency.name**: `string`

### nativeCurrency.symbol

> **nativeCurrency.symbol**: `string`

### rpcUrls

> **rpcUrls**: readonly `string`[]

## Source

[packages/decorators/src/eip1193/AddEthereumChainParameter.ts:7](https://github.com/evmts/tevm-monorepo/blob/main/packages/decorators/src/eip1193/AddEthereumChainParameter.ts#L7)

***
Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)
