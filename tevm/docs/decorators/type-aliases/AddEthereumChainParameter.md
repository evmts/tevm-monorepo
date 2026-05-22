[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [decorators](../README.md) / AddEthereumChainParameter

# Type Alias: AddEthereumChainParameter

> **AddEthereumChainParameter** = `object`

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

| Property | Type | Description |
| ------ | ------ | ------ |
| <a id="blockexplorerurls"></a> `blockExplorerUrls?` | `string`[] | - |
| <a id="chainid"></a> `chainId` | `string` | A 0x-prefixed hexadecimal string |
| <a id="chainname"></a> `chainName` | `string` | The chain name. |
| <a id="iconurls"></a> `iconUrls?` | `string`[] | - |
| <a id="nativecurrency"></a> `nativeCurrency?` | `object` | Native currency for the chain. |
| `nativeCurrency.decimals` | `number` | - |
| `nativeCurrency.name` | `string` | - |
| `nativeCurrency.symbol` | `string` | - |
| <a id="rpcurls"></a> `rpcUrls` | readonly `string`[] | - |
