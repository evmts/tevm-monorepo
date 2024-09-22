[**tevm**](../../README.md) • **Docs**

***

[tevm](../../modules.md) / [common](../README.md) / oasys

# Variable: oasys

> `const` **oasys**: `Common`

Creates a common configuration for the oasys chain.

## Description

Chain ID: 248
Chain Name: Oasys
Default Block Explorer: https://scan.oasys.games
Default RPC URL: https://rpc.mainnet.oasys.games

## Example

```ts
import { createMemoryClient } from 'tevm'
import { oasys } from 'tevm/common'
import { http } from 'tevm'

const client = createMemoryClient({
  common: oasys,
  fork: {
    transport: http({ url: 'https://example.com' })({})
  },
})
```

## Defined in

packages/common/types/presets/oasys.d.ts:21
