[**tevm**](../../README.md) • **Docs**

***

[tevm](../../modules.md) / [common](../README.md) / berachainTestnetbArtio

# Variable: berachainTestnetbArtio

> `const` **berachainTestnetbArtio**: `Common`

Creates a common configuration for the berachainTestnetbArtio chain.

## Description

Chain ID: 80084
Chain Name: Berachain bArtio
Default Block Explorer: https://bartio.beratrail.io
Default RPC URL: https://bartio.rpc.berachain.com

## Example

```ts
import { createMemoryClient } from 'tevm'
import { berachainTestnetbArtio } from 'tevm/common'
import { http } from 'tevm'

const client = createMemoryClient({
  common: berachainTestnetbArtio,
  fork: {
    transport: http({ url: 'https://example.com' })({})
  },
})
```

## Defined in

packages/common/types/presets/berachainTestnetbArtio.d.ts:21
