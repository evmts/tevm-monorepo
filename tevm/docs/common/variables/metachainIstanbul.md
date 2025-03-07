[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [common](../README.md) / metachainIstanbul

# Variable: metachainIstanbul

> `const` **metachainIstanbul**: [`Common`](../type-aliases/Common.md)

Defined in: packages/common/types/presets/metachainIstanbul.d.ts:21

Creates a common configuration for the metachainIstanbul chain.

## Description

Chain ID: 1453
Chain Name: MetaChain Istanbul
Default Block Explorer: https://istanbul-explorer.metachain.dev
Default RPC URL: https://istanbul-rpc.metachain.dev

## Example

```ts
import { createMemoryClient } from 'tevm'
import { metachainIstanbul } from 'tevm/common'
import { http } from 'tevm'

const client = createMemoryClient({
  common: metachainIstanbul,
  fork: {
    transport: http({ url: 'https://example.com' })({})
  },
})
```
