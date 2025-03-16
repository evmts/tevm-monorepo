[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [decorators](../README.md) / AddEthereumChainParameter

# Type Alias: AddEthereumChainParameter

> **AddEthereumChainParameter**: `object`

Defined in: packages/decorators/dist/index.d.ts:235

Parameters for wallet_addEthereumChain RPC method (EIP-3085).
Used to request that a wallet adds a specific blockchain network.

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

## Example

```typescript
import { AddEthereumChainParameter } from '@tevm/decorators'

const optimismChain: AddEthereumChainParameter = {
  chainId: '0xa',  // 10 in hex
  chainName: 'Optimism',
  nativeCurrency: {
    name: 'Ether',
    symbol: 'ETH',
    decimals: 18
  },
  rpcUrls: ['https://mainnet.optimism.io'],
  blockExplorerUrls: ['https://optimistic.etherscan.io']
}
```
