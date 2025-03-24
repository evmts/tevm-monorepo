[**@tevm/decorators**](../README.md)

***

[@tevm/decorators](../globals.md) / AddEthereumChainParameter

# Type Alias: AddEthereumChainParameter

> **AddEthereumChainParameter** = `object`

Defined in: [eip1193/AddEthereumChainParameter.ts:27](https://github.com/evmts/tevm-monorepo/blob/main/packages/decorators/src/eip1193/AddEthereumChainParameter.ts#L27)

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

Defined in: [eip1193/AddEthereumChainParameter.ts:39](https://github.com/evmts/tevm-monorepo/blob/main/packages/decorators/src/eip1193/AddEthereumChainParameter.ts#L39)

***

### chainId

> **chainId**: `string`

Defined in: [eip1193/AddEthereumChainParameter.ts:29](https://github.com/evmts/tevm-monorepo/blob/main/packages/decorators/src/eip1193/AddEthereumChainParameter.ts#L29)

A 0x-prefixed hexadecimal string

***

### chainName

> **chainName**: `string`

Defined in: [eip1193/AddEthereumChainParameter.ts:31](https://github.com/evmts/tevm-monorepo/blob/main/packages/decorators/src/eip1193/AddEthereumChainParameter.ts#L31)

The chain name.

***

### iconUrls?

> `optional` **iconUrls**: `string`[]

Defined in: [eip1193/AddEthereumChainParameter.ts:40](https://github.com/evmts/tevm-monorepo/blob/main/packages/decorators/src/eip1193/AddEthereumChainParameter.ts#L40)

***

### nativeCurrency?

> `optional` **nativeCurrency**: `object`

Defined in: [eip1193/AddEthereumChainParameter.ts:33](https://github.com/evmts/tevm-monorepo/blob/main/packages/decorators/src/eip1193/AddEthereumChainParameter.ts#L33)

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

Defined in: [eip1193/AddEthereumChainParameter.ts:38](https://github.com/evmts/tevm-monorepo/blob/main/packages/decorators/src/eip1193/AddEthereumChainParameter.ts#L38)
