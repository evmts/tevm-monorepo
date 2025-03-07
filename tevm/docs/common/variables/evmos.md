[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [common](../README.md) / evmos

# Variable: evmos

> `const` **evmos**: [`Common`](../type-aliases/Common.md)

Defined in: packages/common/types/presets/evmos.d.ts:21

Creates a common configuration for the evmos chain.

## Description

Chain ID: 9001
Chain Name: Evmos
Default Block Explorer: https://escan.live
Default RPC URL: https://eth.bd.evmos.org:8545

## Example

```ts
import { createMemoryClient } from 'tevm'
import { evmos } from 'tevm/common'
import { http } from 'tevm'

const client = createMemoryClient({
  common: evmos,
  fork: {
    transport: http({ url: 'https://example.com' })({})
  },
})
```
