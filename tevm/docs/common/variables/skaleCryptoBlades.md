[**tevm**](../../README.md) • **Docs**

***

[tevm](../../modules.md) / [common](../README.md) / skaleCryptoBlades

# Variable: skaleCryptoBlades

> `const` **skaleCryptoBlades**: `Common`

Creates a common configuration for the skaleCryptoBlades chain.

## Description

Chain ID: 1026062157
Chain Name: SKALE | CryptoBlades
Default Block Explorer: https://affectionate-immediate-pollux.explorer.mainnet.skalenodes.com
Default RPC URL: https://mainnet.skalenodes.com/v1/affectionate-immediate-pollux

## Example

```ts
import { createMemoryClient } from 'tevm'
import { skaleCryptoBlades } from 'tevm/common'
import { http } from 'tevm'

const client = createMemoryClient({
  common: skaleCryptoBlades,
  fork: {
    transport: http({ url: 'https://example.com' })({})
  },
})
```

## Defined in

packages/common/types/presets/skaleCryptoBlades.d.ts:21
