[**tevm**](../../README.md) • **Docs**

***

[tevm](../../modules.md) / [common](../README.md) / beam

# Variable: beam

> `const` **beam**: `Common`

Creates a common configuration for the beam chain.

## Description

Chain ID: 4337
Chain Name: Beam
Default Block Explorer: https://subnets.avax.network/beam
Default RPC URL: https://build.onbeam.com/rpc

## Example

```ts
import { createMemoryClient } from 'tevm'
import { beam } from 'tevm/common'
import { http } from 'tevm'

const client = createMemoryClient({
  common: beam,
  fork: {
    transport: http({ url: 'https://example.com' })({})
  },
})
```

## Defined in

packages/common/types/presets/beam.d.ts:21
