[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [common](../README.md) / skaleCalypso

# Variable: skaleCalypso

> `const` **skaleCalypso**: [`Common`](../type-aliases/Common.md)

Defined in: packages/common/types/presets/skaleCalypso.d.ts:21

Creates a common configuration for the skaleCalypso chain.

## Description

Chain ID: 1564830818
Chain Name: SKALE | Calypso NFT Hub
Default Block Explorer: https://honorable-steel-rasalhague.explorer.mainnet.skalenodes.com
Default RPC URL: https://mainnet.skalenodes.com/v1/honorable-steel-rasalhague

## Example

```ts
import { createMemoryClient } from 'tevm'
import { skaleCalypso } from 'tevm/common'
import { http } from 'tevm'

const client = createMemoryClient({
  common: skaleCalypso,
  fork: {
    transport: http({ url: 'https://example.com' })({})
  },
})
```
