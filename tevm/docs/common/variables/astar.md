[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [common](../README.md) / astar

# Variable: astar

> `const` **astar**: [`Common`](../type-aliases/Common.md)

Defined in: packages/common/types/presets/astar.d.ts:21

Creates a common configuration for the astar chain.

## Description

Chain ID: 592
Chain Name: Astar
Default Block Explorer: https://astar.subscan.io
Default RPC URL: https://astar.api.onfinality.io/public

## Example

```ts
import { createMemoryClient } from 'tevm'
import { astar } from 'tevm/common'
import { http } from 'tevm'

const client = createMemoryClient({
  common: astar,
  fork: {
    transport: http({ url: 'https://example.com' })({})
  },
})
```
