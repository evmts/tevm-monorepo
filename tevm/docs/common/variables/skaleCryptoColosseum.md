[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [common](../README.md) / skaleCryptoColosseum

# Variable: skaleCryptoColosseum

> `const` **skaleCryptoColosseum**: [`Common`](../type-aliases/Common.md)

Defined in: packages/common/types/presets/skaleCryptoColosseum.d.ts:21

Creates a common configuration for the skaleCryptoColosseum chain.

## Description

Chain ID: 1032942172
Chain Name: SKALE | Crypto Colosseum
Default Block Explorer: https://haunting-devoted-deneb.explorer.mainnet.skalenodes.com
Default RPC URL: https://mainnet.skalenodes.com/v1/haunting-devoted-deneb

## Example

```ts
import { createMemoryClient } from 'tevm'
import { skaleCryptoColosseum } from 'tevm/common'
import { http } from 'tevm'

const client = createMemoryClient({
  common: skaleCryptoColosseum,
  fork: {
    transport: http({ url: 'https://example.com' })({})
  },
})
```
