[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [common](../README.md) / skaleBlockBrawlers

# Variable: skaleBlockBrawlers

> `const` **skaleBlockBrawlers**: [`Common`](../type-aliases/Common.md)

Defined in: packages/common/types/presets/skaleBlockBrawlers.d.ts:21

Creates a common configuration for the skaleBlockBrawlers chain.

## Description

Chain ID: 391845894
Chain Name: SKALE | Block Brawlers
Default Block Explorer: https://frayed-decent-antares.explorer.mainnet.skalenodes.com
Default RPC URL: https://mainnet.skalenodes.com/v1/frayed-decent-antares

## Example

```ts
import { createMemoryClient } from 'tevm'
import { skaleBlockBrawlers } from 'tevm/common'
import { http } from 'tevm'

const client = createMemoryClient({
  common: skaleBlockBrawlers,
  fork: {
    transport: http({ url: 'https://example.com' })({})
  },
})
```
