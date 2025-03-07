[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [common](../README.md) / edgeless

# Variable: edgeless

> `const` **edgeless**: [`Common`](../type-aliases/Common.md)

Defined in: packages/common/types/presets/edgeless.d.ts:21

Creates a common configuration for the edgeless chain.

## Description

Chain ID: 2026
Chain Name: Edgeless Network
Default Block Explorer: https://explorer.edgeless.network
Default RPC URL: https://rpc.edgeless.network/http

## Example

```ts
import { createMemoryClient } from 'tevm'
import { edgeless } from 'tevm/common'
import { http } from 'tevm'

const client = createMemoryClient({
  common: edgeless,
  fork: {
    transport: http({ url: 'https://example.com' })({})
  },
})
```
