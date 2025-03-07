[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [common](../README.md) / immutableZkEvm

# Variable: immutableZkEvm

> `const` **immutableZkEvm**: [`Common`](../type-aliases/Common.md)

Defined in: packages/common/types/presets/immutableZkEvm.d.ts:21

Creates a common configuration for the immutableZkEvm chain.

## Description

Chain ID: 13371
Chain Name: Immutable zkEVM
Default Block Explorer: https://explorer.immutable.com
Default RPC URL: https://rpc.immutable.com

## Example

```ts
import { createMemoryClient } from 'tevm'
import { immutableZkEvm } from 'tevm/common'
import { http } from 'tevm'

const client = createMemoryClient({
  common: immutableZkEvm,
  fork: {
    transport: http({ url: 'https://example.com' })({})
  },
})
```
