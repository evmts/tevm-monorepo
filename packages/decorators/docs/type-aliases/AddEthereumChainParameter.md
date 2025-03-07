[**@tevm/decorators**](../README.md)

***

[@tevm/decorators](../globals.md) / AddEthereumChainParameter

# Type Alias: AddEthereumChainParameter

> **AddEthereumChainParameter**: `object`

Defined in: [eip1193/AddEthereumChainParameter.ts:7](https://github.com/evmts/tevm-monorepo/blob/main/packages/decorators/src/eip1193/AddEthereumChainParameter.ts#L7)

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

#### nativeCurrency.decimals

> **decimals**: `number`

#### nativeCurrency.name

> **name**: `string`

#### nativeCurrency.symbol

> **symbol**: `string`

### rpcUrls

> **rpcUrls**: readonly `string`[]
