[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [common](../README.md) / xdc

# Variable: xdc

> `const` **xdc**: [`Common`](../type-aliases/Common.md)

Defined in: packages/common/types/presets/xdc.d.ts:21

Creates a common configuration for the xdc chain.

## Description

Chain ID: 50
Chain Name: XinFin Network
Default Block Explorer: https://xdc.blocksscan.io
Default RPC URL: https://rpc.xinfin.network

## Example

```ts
import { createMemoryClient } from 'tevm'
import { xdc } from 'tevm/common'
import { http } from 'tevm'

const client = createMemoryClient({
  common: xdc,
  fork: {
    transport: http({ url: 'https://example.com' })({})
  },
})
```
