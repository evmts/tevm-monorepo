[**tevm**](../../README.md) • **Docs**

***

[tevm](../../modules.md) / [common](../README.md) / skaleExorde

# Variable: skaleExorde

> `const` **skaleExorde**: `Common`

Creates a common configuration for the skaleExorde chain.

## Description

Chain ID: 2139927552
Chain Name: SKALE | Exorde
Default Block Explorer: https://light-vast-diphda.explorer.mainnet.skalenodes.com
Default RPC URL: https://mainnet.skalenodes.com/v1/light-vast-diphda

## Example

```ts
import { createMemoryClient } from 'tevm'
import { skaleExorde } from 'tevm/common'
import { http } from 'tevm'

const client = createMemoryClient({
  common: skaleExorde,
  fork: {
    transport: http({ url: 'https://example.com' })({})
  },
})
```

## Defined in

packages/common/types/presets/skaleExorde.d.ts:21
