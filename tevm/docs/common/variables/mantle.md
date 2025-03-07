[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [common](../README.md) / mantle

# Variable: mantle

> `const` **mantle**: [`Common`](../type-aliases/Common.md)

Defined in: packages/common/types/presets/mantle.d.ts:21

Creates a common configuration for the mantle chain.

## Description

Chain ID: 5000
Chain Name: Mantle
Default Block Explorer: https://mantlescan.xyz/
Default RPC URL: https://rpc.mantle.xyz

## Example

```ts
import { createMemoryClient } from 'tevm'
import { mantle } from 'tevm/common'
import { http } from 'tevm'

const client = createMemoryClient({
  common: mantle,
  fork: {
    transport: http({ url: 'https://example.com' })({})
  },
})
```
