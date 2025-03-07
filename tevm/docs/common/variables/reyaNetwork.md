[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [common](../README.md) / reyaNetwork

# Variable: reyaNetwork

> `const` **reyaNetwork**: [`Common`](../type-aliases/Common.md)

Defined in: packages/common/types/presets/reyaNetwork.d.ts:21

Creates a common configuration for the reyaNetwork chain.

## Description

Chain ID: 1729
Chain Name: Reya Network
Default Block Explorer: https://explorer.reya.network
Default RPC URL: https://rpc.reya.network

## Example

```ts
import { createMemoryClient } from 'tevm'
import { reyaNetwork } from 'tevm/common'
import { http } from 'tevm'

const client = createMemoryClient({
  common: reyaNetwork,
  fork: {
    transport: http({ url: 'https://example.com' })({})
  },
})
```
