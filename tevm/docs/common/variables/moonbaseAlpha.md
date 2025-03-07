[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [common](../README.md) / moonbaseAlpha

# Variable: moonbaseAlpha

> `const` **moonbaseAlpha**: [`Common`](../type-aliases/Common.md)

Defined in: packages/common/types/presets/moonbaseAlpha.d.ts:21

Creates a common configuration for the moonbaseAlpha chain.

## Description

Chain ID: 1287
Chain Name: Moonbase Alpha
Default Block Explorer: https://moonbase.moonscan.io
Default RPC URL: https://rpc.api.moonbase.moonbeam.network

## Example

```ts
import { createMemoryClient } from 'tevm'
import { moonbaseAlpha } from 'tevm/common'
import { http } from 'tevm'

const client = createMemoryClient({
  common: moonbaseAlpha,
  fork: {
    transport: http({ url: 'https://example.com' })({})
  },
})
```
