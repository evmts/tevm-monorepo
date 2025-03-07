[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [common](../README.md) / zksync

# Variable: zksync

> `const` **zksync**: [`Common`](../type-aliases/Common.md)

Defined in: packages/common/types/presets/zksync.d.ts:21

Creates a common configuration for the zksync chain.

## Description

Chain ID: 324
Chain Name: ZKsync Era
Default Block Explorer: https://era.zksync.network/
Default RPC URL: https://mainnet.era.zksync.io

## Example

```ts
import { createMemoryClient } from 'tevm'
import { zksync } from 'tevm/common'
import { http } from 'tevm'

const client = createMemoryClient({
  common: zksync,
  fork: {
    transport: http({ url: 'https://example.com' })({})
  },
})
```
