[**tevm**](../../README.md) • **Docs**

***

[tevm](../../modules.md) / [common](../README.md) / morphHolesky

# Variable: morphHolesky

> `const` **morphHolesky**: `Common`

Creates a common configuration for the morphHolesky chain.

## Description

Chain ID: 2810
Chain Name: Morph Holesky
Default Block Explorer: https://explorer-holesky.morphl2.io
Default RPC URL: https://rpc-quicknode-holesky.morphl2.io

## Example

```ts
import { createMemoryClient } from 'tevm'
import { morphHolesky } from 'tevm/common'
import { http } from 'tevm'

const client = createMemoryClient({
  common: morphHolesky,
  fork: {
    transport: http({ url: 'https://example.com' })({})
  },
})
```

## Defined in

packages/common/types/presets/morphHolesky.d.ts:21
