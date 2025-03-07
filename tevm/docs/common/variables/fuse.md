[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [common](../README.md) / fuse

# Variable: fuse

> `const` **fuse**: [`Common`](../type-aliases/Common.md)

Defined in: packages/common/types/presets/fuse.d.ts:21

Creates a common configuration for the fuse chain.

## Description

Chain ID: 122
Chain Name: Fuse
Default Block Explorer: https://explorer.fuse.io
Default RPC URL: https://rpc.fuse.io

## Example

```ts
import { createMemoryClient } from 'tevm'
import { fuse } from 'tevm/common'
import { http } from 'tevm'

const client = createMemoryClient({
  common: fuse,
  fork: {
    transport: http({ url: 'https://example.com' })({})
  },
})
```
