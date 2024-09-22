[**tevm**](../../README.md) • **Docs**

***

[tevm](../../modules.md) / [common](../README.md) / avalanche

# Variable: avalanche

> `const` **avalanche**: `Common`

Creates a common configuration for the avalanche chain.

## Description

Chain ID: 43114
Chain Name: Avalanche
Default Block Explorer: https://snowtrace.io
Default RPC URL: https://api.avax.network/ext/bc/C/rpc

## Example

```ts
import { createMemoryClient } from 'tevm'
import { avalanche } from 'tevm/common'
import { http } from 'tevm'

const client = createMemoryClient({
  common: avalanche,
  fork: {
    transport: http({ url: 'https://example.com' })({})
  },
})
```

## Defined in

packages/common/types/presets/avalanche.d.ts:21
