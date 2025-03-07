[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [common](../README.md) / arbitrumSepolia

# Variable: arbitrumSepolia

> `const` **arbitrumSepolia**: [`Common`](../type-aliases/Common.md)

Defined in: packages/common/types/presets/arbitrumSepolia.d.ts:21

Creates a common configuration for the arbitrumSepolia chain.

## Description

Chain ID: 421614
Chain Name: Arbitrum Sepolia
Default Block Explorer: https://sepolia.arbiscan.io
Default RPC URL: https://sepolia-rollup.arbitrum.io/rpc

## Example

```ts
import { createMemoryClient } from 'tevm'
import { arbitrumSepolia } from 'tevm/common'
import { http } from 'tevm'

const client = createMemoryClient({
  common: arbitrumSepolia,
  fork: {
    transport: http({ url: 'https://example.com' })({})
  },
})
```
