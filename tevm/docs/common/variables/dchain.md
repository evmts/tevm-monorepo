[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [common](../README.md) / dchain

# Variable: dchain

> `const` **dchain**: [`Common`](../type-aliases/Common.md)

Defined in: packages/common/types/presets/dchain.d.ts:21

Creates a common configuration for the dchain chain.

## Description

Chain ID: 2716446429837000
Chain Name: Dchain
Default Block Explorer: https://dchain-2716446429837000-1.sagaexplorer.io
Default RPC URL: https://dchain-2716446429837000-1.jsonrpc.sagarpc.io

## Example

```ts
import { createMemoryClient } from 'tevm'
import { dchain } from 'tevm/common'
import { http } from 'tevm'

const client = createMemoryClient({
  common: dchain,
  fork: {
    transport: http({ url: 'https://example.com' })({})
  },
})
```
