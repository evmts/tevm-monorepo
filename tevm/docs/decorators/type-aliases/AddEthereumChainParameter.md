[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [decorators](../README.md) / AddEthereumChainParameter

# Type Alias: AddEthereumChainParameter

> **AddEthereumChainParameter** = `object`

Defined in: packages/decorators/dist/index.d.ts:235

Parameters for wallet_addEthereumChain RPC method (EIP-3085).
Used to request that a wallet adds a specific blockchain network.

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

## Properties

### blockExplorerUrls?

> `optional` **blockExplorerUrls**: `string`[]

Defined in: packages/decorators/dist/index.d.ts:247

***

### chainId

> **chainId**: `string`

Defined in: packages/decorators/dist/index.d.ts:237

A 0x-prefixed hexadecimal string

***

### chainName

> **chainName**: `string`

Defined in: packages/decorators/dist/index.d.ts:239

The chain name.

***

### iconUrls?

> `optional` **iconUrls**: `string`[]

Defined in: packages/decorators/dist/index.d.ts:248

***

### nativeCurrency?

> `optional` **nativeCurrency**: `object`

Defined in: packages/decorators/dist/index.d.ts:241

Native currency for the chain.

#### decimals

> **decimals**: `number`

#### name

> **name**: `string`

#### symbol

> **symbol**: `string`

***

### rpcUrls

> **rpcUrls**: readonly `string`[]

Defined in: packages/decorators/dist/index.d.ts:246
