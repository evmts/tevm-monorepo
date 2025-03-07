[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [common](../README.md) / skaleTitan

# Variable: skaleTitan

> `const` **skaleTitan**: [`Common`](../type-aliases/Common.md)

Defined in: packages/common/types/presets/skaleTitan.d.ts:21

Creates a common configuration for the skaleTitan chain.

## Description

Chain ID: 1350216234
Chain Name: SKALE | Titan Community Hub
Default Block Explorer: https://parallel-stormy-spica.explorer.mainnet.skalenodes.com
Default RPC URL: https://mainnet.skalenodes.com/v1/parallel-stormy-spica

## Example

```ts
import { createMemoryClient } from 'tevm'
import { skaleTitan } from 'tevm/common'
import { http } from 'tevm'

const client = createMemoryClient({
  common: skaleTitan,
  fork: {
    transport: http({ url: 'https://example.com' })({})
  },
})
```
