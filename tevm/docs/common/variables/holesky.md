[**tevm**](../../README.md) • **Docs**

***

[tevm](../../modules.md) / [common](../README.md) / holesky

# Variable: holesky

> `const` **holesky**: `Common`

Creates a common configuration for the holesky chain.

## Description

Chain ID: 17000
Chain Name: Holesky
Default Block Explorer: https://holesky.etherscan.io
Default RPC URL: https://ethereum-holesky-rpc.publicnode.com

## Example

```ts
import { createMemoryClient } from 'tevm'
import { holesky } from 'tevm/common'
import { http } from 'tevm'

const client = createMemoryClient({
  common: holesky,
  fork: {
    transport: http({ url: 'https://example.com' })({})
  },
})
```

## Defined in

packages/common/types/presets/holesky.d.ts:21
