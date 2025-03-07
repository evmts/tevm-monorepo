[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [common](../README.md) / kromaSepolia

# Variable: kromaSepolia

> `const` **kromaSepolia**: [`Common`](../type-aliases/Common.md)

Defined in: packages/common/types/presets/kromaSepolia.d.ts:21

Creates a common configuration for the kromaSepolia chain.

## Description

Chain ID: 2358
Chain Name: Kroma Sepolia
Default Block Explorer: https://blockscout.sepolia.kroma.network
Default RPC URL: https://api.sepolia.kroma.network

## Example

```ts
import { createMemoryClient } from 'tevm'
import { kromaSepolia } from 'tevm/common'
import { http } from 'tevm'

const client = createMemoryClient({
  common: kromaSepolia,
  fork: {
    transport: http({ url: 'https://example.com' })({})
  },
})
```
