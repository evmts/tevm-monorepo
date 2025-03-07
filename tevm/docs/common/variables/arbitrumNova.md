[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [common](../README.md) / arbitrumNova

# Variable: arbitrumNova

> `const` **arbitrumNova**: [`Common`](../type-aliases/Common.md)

Defined in: packages/common/types/presets/arbitrumNova.d.ts:21

Creates a common configuration for the arbitrumNova chain.

## Description

Chain ID: 42170
Chain Name: Arbitrum Nova
Default Block Explorer: https://nova.arbiscan.io
Default RPC URL: https://nova.arbitrum.io/rpc

## Example

```ts
import { createMemoryClient } from 'tevm'
import { arbitrumNova } from 'tevm/common'
import { http } from 'tevm'

const client = createMemoryClient({
  common: arbitrumNova,
  fork: {
    transport: http({ url: 'https://example.com' })({})
  },
})
```
