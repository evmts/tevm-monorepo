[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [common](../README.md) / skaleNebula

# Variable: skaleNebula

> `const` **skaleNebula**: [`Common`](../type-aliases/Common.md)

Defined in: packages/common/types/presets/skaleNebula.d.ts:21

Creates a common configuration for the skaleNebula chain.

## Description

Chain ID: 1482601649
Chain Name: SKALE | Nebula Gaming Hub
Default Block Explorer: https://green-giddy-denebola.explorer.mainnet.skalenodes.com
Default RPC URL: https://mainnet.skalenodes.com/v1/green-giddy-denebola

## Example

```ts
import { createMemoryClient } from 'tevm'
import { skaleNebula } from 'tevm/common'
import { http } from 'tevm'

const client = createMemoryClient({
  common: skaleNebula,
  fork: {
    transport: http({ url: 'https://example.com' })({})
  },
})
```
