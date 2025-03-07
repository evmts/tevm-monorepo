[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [common](../README.md) / arbitrum

# Variable: arbitrum

> `const` **arbitrum**: [`Common`](../type-aliases/Common.md)

Defined in: packages/common/types/presets/arbitrum.d.ts:21

Creates a common configuration for the arbitrum chain.

## Description

Chain ID: 42161
Chain Name: Arbitrum One
Default Block Explorer: https://arbiscan.io
Default RPC URL: https://arb1.arbitrum.io/rpc

## Example

```ts
import { createMemoryClient } from 'tevm'
import { arbitrum } from 'tevm/common'
import { http } from 'tevm'

const client = createMemoryClient({
  common: arbitrum,
  fork: {
    transport: http({ url: 'https://example.com' })({})
  },
})
```
