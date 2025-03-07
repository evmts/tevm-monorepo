[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [common](../README.md) / boba

# Variable: boba

> `const` **boba**: [`Common`](../type-aliases/Common.md)

Defined in: packages/common/types/presets/boba.d.ts:21

Creates a common configuration for the boba chain.

## Description

Chain ID: 288
Chain Name: Boba Network
Default Block Explorer: https://bobascan.com
Default RPC URL: https://mainnet.boba.network

## Example

```ts
import { createMemoryClient } from 'tevm'
import { boba } from 'tevm/common'
import { http } from 'tevm'

const client = createMemoryClient({
  common: boba,
  fork: {
    transport: http({ url: 'https://example.com' })({})
  },
})
```
