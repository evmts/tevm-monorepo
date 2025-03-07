[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [common](../README.md) / crossbell

# Variable: crossbell

> `const` **crossbell**: [`Common`](../type-aliases/Common.md)

Defined in: packages/common/types/presets/crossbell.d.ts:21

Creates a common configuration for the crossbell chain.

## Description

Chain ID: 3737
Chain Name: Crossbell
Default Block Explorer: https://scan.crossbell.io
Default RPC URL: https://rpc.crossbell.io

## Example

```ts
import { createMemoryClient } from 'tevm'
import { crossbell } from 'tevm/common'
import { http } from 'tevm'

const client = createMemoryClient({
  common: crossbell,
  fork: {
    transport: http({ url: 'https://example.com' })({})
  },
})
```
