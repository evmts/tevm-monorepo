[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [common](../README.md) / shimmer

# Variable: shimmer

> `const` **shimmer**: [`Common`](../type-aliases/Common.md)

Defined in: packages/common/types/presets/shimmer.d.ts:21

Creates a common configuration for the shimmer chain.

## Description

Chain ID: 148
Chain Name: Shimmer
Default Block Explorer: https://explorer.evm.shimmer.network
Default RPC URL: https://json-rpc.evm.shimmer.network

## Example

```ts
import { createMemoryClient } from 'tevm'
import { shimmer } from 'tevm/common'
import { http } from 'tevm'

const client = createMemoryClient({
  common: shimmer,
  fork: {
    transport: http({ url: 'https://example.com' })({})
  },
})
```
