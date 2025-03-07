[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [common](../README.md) / bitkub

# Variable: bitkub

> `const` **bitkub**: [`Common`](../type-aliases/Common.md)

Defined in: packages/common/types/presets/bitkub.d.ts:21

Creates a common configuration for the bitkub chain.

## Description

Chain ID: 96
Chain Name: Bitkub
Default Block Explorer: https://www.bkcscan.com
Default RPC URL: https://rpc.bitkubchain.io

## Example

```ts
import { createMemoryClient } from 'tevm'
import { bitkub } from 'tevm/common'
import { http } from 'tevm'

const client = createMemoryClient({
  common: bitkub,
  fork: {
    transport: http({ url: 'https://example.com' })({})
  },
})
```
