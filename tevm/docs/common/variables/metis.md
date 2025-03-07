[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [common](../README.md) / metis

# Variable: metis

> `const` **metis**: [`Common`](../type-aliases/Common.md)

Defined in: packages/common/types/presets/metis.d.ts:21

Creates a common configuration for the metis chain.

## Description

Chain ID: 1088
Chain Name: Metis
Default Block Explorer: https://explorer.metis.io
Default RPC URL: https://andromeda.metis.io/?owner=1088

## Example

```ts
import { createMemoryClient } from 'tevm'
import { metis } from 'tevm/common'
import { http } from 'tevm'

const client = createMemoryClient({
  common: metis,
  fork: {
    transport: http({ url: 'https://example.com' })({})
  },
})
```
