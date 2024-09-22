[**tevm**](../../README.md) • **Docs**

***

[tevm](../../modules.md) / [common](../README.md) / lycan

# Variable: lycan

> `const` **lycan**: `Common`

Creates a common configuration for the lycan chain.

## Description

Chain ID: 721
Chain Name: Lycan
Default Block Explorer: https://explorer.lycanchain.com
Default RPC URL: https://rpc.lycanchain.com

## Example

```ts
import { createMemoryClient } from 'tevm'
import { lycan } from 'tevm/common'
import { http } from 'tevm'

const client = createMemoryClient({
  common: lycan,
  fork: {
    transport: http({ url: 'https://example.com' })({})
  },
})
```

## Defined in

packages/common/types/presets/lycan.d.ts:21
