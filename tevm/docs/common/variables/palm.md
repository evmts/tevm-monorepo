[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [common](../README.md) / palm

# Variable: palm

> `const` **palm**: [`Common`](../type-aliases/Common.md)

Defined in: packages/common/types/presets/palm.d.ts:21

Creates a common configuration for the palm chain.

## Description

Chain ID: 11297108109
Chain Name: Palm
Default Block Explorer: https://palm.chainlens.com
Default RPC URL: https://palm-mainnet.public.blastapi.io

## Example

```ts
import { createMemoryClient } from 'tevm'
import { palm } from 'tevm/common'
import { http } from 'tevm'

const client = createMemoryClient({
  common: palm,
  fork: {
    transport: http({ url: 'https://example.com' })({})
  },
})
```
