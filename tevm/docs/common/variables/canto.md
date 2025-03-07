[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [common](../README.md) / canto

# Variable: canto

> `const` **canto**: [`Common`](../type-aliases/Common.md)

Defined in: packages/common/types/presets/canto.d.ts:21

Creates a common configuration for the canto chain.

## Description

Chain ID: 7700
Chain Name: Canto
Default Block Explorer: https://tuber.build
Default RPC URL: https://canto.gravitychain.io

## Example

```ts
import { createMemoryClient } from 'tevm'
import { canto } from 'tevm/common'
import { http } from 'tevm'

const client = createMemoryClient({
  common: canto,
  fork: {
    transport: http({ url: 'https://example.com' })({})
  },
})
```
