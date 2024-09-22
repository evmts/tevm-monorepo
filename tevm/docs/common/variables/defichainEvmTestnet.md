[**tevm**](../../README.md) • **Docs**

***

[tevm](../../modules.md) / [common](../README.md) / defichainEvmTestnet

# Variable: defichainEvmTestnet

> `const` **defichainEvmTestnet**: `Common`

Creates a common configuration for the defichainEvmTestnet chain.

## Description

Chain ID: 1131
Chain Name: DeFiChain EVM Testnet
Default Block Explorer: https://meta.defiscan.live/?network=TestNet
Default RPC URL: https://eth.testnet.ocean.jellyfishsdk.com

## Example

```ts
import { createMemoryClient } from 'tevm'
import { defichainEvmTestnet } from 'tevm/common'
import { http } from 'tevm'

const client = createMemoryClient({
  common: defichainEvmTestnet,
  fork: {
    transport: http({ url: 'https://example.com' })({})
  },
})
```

## Defined in

packages/common/types/presets/defichainEvmTestnet.d.ts:21
