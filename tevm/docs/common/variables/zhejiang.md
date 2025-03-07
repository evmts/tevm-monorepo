[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [common](../README.md) / zhejiang

# Variable: zhejiang

> `const` **zhejiang**: [`Common`](../type-aliases/Common.md)

Defined in: packages/common/types/presets/zhejiang.d.ts:21

Creates a common configuration for the zhejiang chain.

## Description

Chain ID: 1337803
Chain Name: Zhejiang
Default Block Explorer: https://zhejiang.beaconcha.in
Default RPC URL: https://rpc.zhejiang.ethpandaops.io

## Example

```ts
import { createMemoryClient } from 'tevm'
import { zhejiang } from 'tevm/common'
import { http } from 'tevm'

const client = createMemoryClient({
  common: zhejiang,
  fork: {
    transport: http({ url: 'https://example.com' })({})
  },
})
```
