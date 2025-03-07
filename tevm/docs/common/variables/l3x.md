[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [common](../README.md) / l3x

# Variable: l3x

> `const` **l3x**: [`Common`](../type-aliases/Common.md)

Defined in: packages/common/types/presets/l3x.d.ts:21

Creates a common configuration for the l3x chain.

## Description

Chain ID: 12324
Chain Name: L3X Protocol
Default Block Explorer: https://explorer.l3x.com
Default RPC URL: https://rpc-mainnet.l3x.com

## Example

```ts
import { createMemoryClient } from 'tevm'
import { l3x } from 'tevm/common'
import { http } from 'tevm'

const client = createMemoryClient({
  common: l3x,
  fork: {
    transport: http({ url: 'https://example.com' })({})
  },
})
```
