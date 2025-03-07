[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [common](../README.md) / bearNetworkChainTestnet

# Variable: bearNetworkChainTestnet

> `const` **bearNetworkChainTestnet**: [`Common`](../type-aliases/Common.md)

Defined in: packages/common/types/presets/bearNetworkChainTestnet.d.ts:21

Creates a common configuration for the bearNetworkChainTestnet chain.

## Description

Chain ID: 751230
Chain Name: Bear Network Chain Testnet
Default Block Explorer: https://brnktest-scan.bearnetwork.net
Default RPC URL: https://brnkc-test.bearnetwork.net

## Example

```ts
import { createMemoryClient } from 'tevm'
import { bearNetworkChainTestnet } from 'tevm/common'
import { http } from 'tevm'

const client = createMemoryClient({
  common: bearNetworkChainTestnet,
  fork: {
    transport: http({ url: 'https://example.com' })({})
  },
})
```
