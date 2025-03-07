[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [common](../README.md) / lisk

# Variable: lisk

> `const` **lisk**: [`Common`](../type-aliases/Common.md)

Defined in: packages/common/types/presets/lisk.d.ts:21

Creates a common configuration for the lisk chain.

## Description

Chain ID: 1135
Chain Name: Lisk
Default Block Explorer: https://blockscout.lisk.com
Default RPC URL: https://rpc.api.lisk.com

## Example

```ts
import { createMemoryClient } from 'tevm'
import { lisk } from 'tevm/common'
import { http } from 'tevm'

const client = createMemoryClient({
  common: lisk,
  fork: {
    transport: http({ url: 'https://example.com' })({})
  },
})
```
