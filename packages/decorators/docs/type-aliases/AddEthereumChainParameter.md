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

| Property | Type | Description | Defined in |
| ------ | ------ | ------ | ------ |
| <a id="blockexplorerurls"></a> `blockExplorerUrls?` | `string`[] | - | [eip1193/AddEthereumChainParameter.ts:39](https://github.com/evmts/tevm-monorepo/blob/main/packages/decorators/src/eip1193/AddEthereumChainParameter.ts#L39) |
| <a id="chainid"></a> `chainId` | `string` | A 0x-prefixed hexadecimal string | [eip1193/AddEthereumChainParameter.ts:29](https://github.com/evmts/tevm-monorepo/blob/main/packages/decorators/src/eip1193/AddEthereumChainParameter.ts#L29) |
| <a id="chainname"></a> `chainName` | `string` | The chain name. | [eip1193/AddEthereumChainParameter.ts:31](https://github.com/evmts/tevm-monorepo/blob/main/packages/decorators/src/eip1193/AddEthereumChainParameter.ts#L31) |
| <a id="iconurls"></a> `iconUrls?` | `string`[] | - | [eip1193/AddEthereumChainParameter.ts:40](https://github.com/evmts/tevm-monorepo/blob/main/packages/decorators/src/eip1193/AddEthereumChainParameter.ts#L40) |
| <a id="nativecurrency"></a> `nativeCurrency?` | `object` | Native currency for the chain. | [eip1193/AddEthereumChainParameter.ts:33](https://github.com/evmts/tevm-monorepo/blob/main/packages/decorators/src/eip1193/AddEthereumChainParameter.ts#L33) |
| `nativeCurrency.decimals` | `number` | - | [eip1193/AddEthereumChainParameter.ts:36](https://github.com/evmts/tevm-monorepo/blob/main/packages/decorators/src/eip1193/AddEthereumChainParameter.ts#L36) |
| `nativeCurrency.name` | `string` | - | [eip1193/AddEthereumChainParameter.ts:34](https://github.com/evmts/tevm-monorepo/blob/main/packages/decorators/src/eip1193/AddEthereumChainParameter.ts#L34) |
| `nativeCurrency.symbol` | `string` | - | [eip1193/AddEthereumChainParameter.ts:35](https://github.com/evmts/tevm-monorepo/blob/main/packages/decorators/src/eip1193/AddEthereumChainParameter.ts#L35) |
| <a id="rpcurls"></a> `rpcUrls` | readonly `string`[] | - | [eip1193/AddEthereumChainParameter.ts:38](https://github.com/evmts/tevm-monorepo/blob/main/packages/decorators/src/eip1193/AddEthereumChainParameter.ts#L38) |
