[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [common](../README.md) / skaleEuropa

# Variable: skaleEuropa

> `const` **skaleEuropa**: [`Common`](../type-aliases/Common.md)

Defined in: packages/common/types/presets/skaleEuropa.d.ts:21

Creates a common configuration for the skaleEuropa chain.

## Description

Chain ID: 2046399126
Chain Name: SKALE | Europa Liquidity Hub
Default Block Explorer: https://elated-tan-skat.explorer.mainnet.skalenodes.com
Default RPC URL: https://mainnet.skalenodes.com/v1/elated-tan-skat

## Example

```ts
import { createMemoryClient } from 'tevm'
import { skaleEuropa } from 'tevm/common'
import { http } from 'tevm'

const client = createMemoryClient({
  common: skaleEuropa,
  fork: {
    transport: http({ url: 'https://example.com' })({})
  },
})
```
