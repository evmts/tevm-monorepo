[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [common](../README.md) / confluxESpace

# Variable: confluxESpace

> `const` **confluxESpace**: [`Common`](../type-aliases/Common.md)

Defined in: packages/common/types/presets/confluxESpace.d.ts:21

Creates a common configuration for the confluxESpace chain.

## Description

Chain ID: 1030
Chain Name: Conflux eSpace
Default Block Explorer: https://evm.confluxscan.io
Default RPC URL: https://evm.confluxrpc.com

## Example

```ts
import { createMemoryClient } from 'tevm'
import { confluxESpace } from 'tevm/common'
import { http } from 'tevm'

const client = createMemoryClient({
  common: confluxESpace,
  fork: {
    transport: http({ url: 'https://example.com' })({})
  },
})
```
