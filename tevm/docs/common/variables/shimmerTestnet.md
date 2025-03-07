[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [common](../README.md) / shimmerTestnet

# Variable: shimmerTestnet

> `const` **shimmerTestnet**: [`Common`](../type-aliases/Common.md)

Defined in: packages/common/types/presets/shimmerTestnet.d.ts:21

Creates a common configuration for the shimmerTestnet chain.

## Description

Chain ID: 1073
Chain Name: Shimmer Testnet
Default Block Explorer: https://explorer.evm.testnet.shimmer.network
Default RPC URL: https://json-rpc.evm.testnet.shimmer.network

## Example

```ts
import { createMemoryClient } from 'tevm'
import { shimmerTestnet } from 'tevm/common'
import { http } from 'tevm'

const client = createMemoryClient({
  common: shimmerTestnet,
  fork: {
    transport: http({ url: 'https://example.com' })({})
  },
})
```
