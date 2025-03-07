[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [common](../README.md) / polygonZkEvm

# Variable: polygonZkEvm

> `const` **polygonZkEvm**: [`Common`](../type-aliases/Common.md)

Defined in: packages/common/types/presets/polygonZkEvm.d.ts:21

Creates a common configuration for the polygonZkEvm chain.

## Description

Chain ID: 1101
Chain Name: Polygon zkEVM
Default Block Explorer: https://zkevm.polygonscan.com
Default RPC URL: https://zkevm-rpc.com

## Example

```ts
import { createMemoryClient } from 'tevm'
import { polygonZkEvm } from 'tevm/common'
import { http } from 'tevm'

const client = createMemoryClient({
  common: polygonZkEvm,
  fork: {
    transport: http({ url: 'https://example.com' })({})
  },
})
```
