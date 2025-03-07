[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [common](../README.md) / assetChainTestnet

# Variable: assetChainTestnet

> `const` **assetChainTestnet**: [`Common`](../type-aliases/Common.md)

Defined in: packages/common/types/presets/assetChainTestnet.d.ts:21

Creates a common configuration for the assetChainTestnet chain.

## Description

Chain ID: 42421
Chain Name: AssetChain Testnet
Default Block Explorer: https://scan-testnet.assetchain.org
Default RPC URL: https://enugu-rpc.assetchain.org

## Example

```ts
import { createMemoryClient } from 'tevm'
import { assetChainTestnet } from 'tevm/common'
import { http } from 'tevm'

const client = createMemoryClient({
  common: assetChainTestnet,
  fork: {
    transport: http({ url: 'https://example.com' })({})
  },
})
```
