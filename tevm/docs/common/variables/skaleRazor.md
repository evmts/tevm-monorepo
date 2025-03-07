[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [common](../README.md) / skaleRazor

# Variable: skaleRazor

> `const` **skaleRazor**: [`Common`](../type-aliases/Common.md)

Defined in: packages/common/types/presets/skaleRazor.d.ts:21

Creates a common configuration for the skaleRazor chain.

## Description

Chain ID: 278611351
Chain Name: SKALE | Razor Network
Default Block Explorer: https://turbulent-unique-scheat.explorer.mainnet.skalenodes.com
Default RPC URL: https://mainnet.skalenodes.com/v1/turbulent-unique-scheat

## Example

```ts
import { createMemoryClient } from 'tevm'
import { skaleRazor } from 'tevm/common'
import { http } from 'tevm'

const client = createMemoryClient({
  common: skaleRazor,
  fork: {
    transport: http({ url: 'https://example.com' })({})
  },
})
```
