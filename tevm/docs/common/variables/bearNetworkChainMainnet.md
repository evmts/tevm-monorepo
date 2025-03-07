[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [common](../README.md) / bearNetworkChainMainnet

# Variable: bearNetworkChainMainnet

> `const` **bearNetworkChainMainnet**: [`Common`](../type-aliases/Common.md)

Defined in: packages/common/types/presets/bearNetworkChainMainnet.d.ts:21

Creates a common configuration for the bearNetworkChainMainnet chain.

## Description

Chain ID: 641230
Chain Name: Bear Network Chain Mainnet
Default Block Explorer: https://brnkscan.bearnetwork.net
Default RPC URL: https://brnkc-mainnet.bearnetwork.net

## Example

```ts
import { createMemoryClient } from 'tevm'
import { bearNetworkChainMainnet } from 'tevm/common'
import { http } from 'tevm'

const client = createMemoryClient({
  common: bearNetworkChainMainnet,
  fork: {
    transport: http({ url: 'https://example.com' })({})
  },
})
```
