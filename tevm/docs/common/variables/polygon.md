[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [common](../README.md) / polygon

# Variable: polygon

> `const` **polygon**: [`Common`](../type-aliases/Common.md)

Defined in: packages/common/types/presets/polygon.d.ts:21

Creates a common configuration for the polygon chain.

## Description

Chain ID: 137
Chain Name: Polygon
Default Block Explorer: https://polygonscan.com
Default RPC URL: https://polygon-rpc.com

## Example

```ts
import { createMemoryClient } from 'tevm'
import { polygon } from 'tevm/common'
import { http } from 'tevm'

const client = createMemoryClient({
  common: polygon,
  fork: {
    transport: http({ url: 'https://example.com' })({})
  },
})
```
