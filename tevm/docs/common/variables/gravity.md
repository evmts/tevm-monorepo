[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [common](../README.md) / gravity

# Variable: gravity

> `const` **gravity**: [`Common`](../type-aliases/Common.md)

Defined in: packages/common/types/presets/gravity.d.ts:21

Creates a common configuration for the gravity chain.

## Description

Chain ID: 1625
Chain Name: Gravity Alpha Mainnet
Default Block Explorer: https://explorer.gravity.xyz
Default RPC URL: https://rpc.gravity.xyz

## Example

```ts
import { createMemoryClient } from 'tevm'
import { gravity } from 'tevm/common'
import { http } from 'tevm'

const client = createMemoryClient({
  common: gravity,
  fork: {
    transport: http({ url: 'https://example.com' })({})
  },
})
```
