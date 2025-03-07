[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [common](../README.md) / rss3

# Variable: rss3

> `const` **rss3**: [`Common`](../type-aliases/Common.md)

Defined in: packages/common/types/presets/rss3.d.ts:21

Creates a common configuration for the rss3 chain.

## Description

Chain ID: 12553
Chain Name: RSS3 VSL Mainnet
Default Block Explorer: https://scan.rss3.io
Default RPC URL: https://rpc.rss3.io

## Example

```ts
import { createMemoryClient } from 'tevm'
import { rss3 } from 'tevm/common'
import { http } from 'tevm'

const client = createMemoryClient({
  common: rss3,
  fork: {
    transport: http({ url: 'https://example.com' })({})
  },
})
```
