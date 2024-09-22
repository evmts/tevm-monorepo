[**tevm**](../../README.md) • **Docs**

***

[tevm](../../modules.md) / [common](../README.md) / nexi

# Variable: nexi

> `const` **nexi**: `Common`

Creates a common configuration for the nexi chain.

## Description

Chain ID: 4242
Chain Name: Nexi
Default Block Explorer: https://www.nexiscan.com
Default RPC URL: https://rpc.chain.nexi.technology

## Example

```ts
import { createMemoryClient } from 'tevm'
import { nexi } from 'tevm/common'
import { http } from 'tevm'

const client = createMemoryClient({
  common: nexi,
  fork: {
    transport: http({ url: 'https://example.com' })({})
  },
})
```

## Defined in

packages/common/types/presets/nexi.d.ts:21
