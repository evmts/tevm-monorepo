[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [common](../README.md) / moonriver

# Variable: moonriver

> `const` **moonriver**: [`Common`](../type-aliases/Common.md)

Defined in: packages/common/types/presets/moonriver.d.ts:21

Creates a common configuration for the moonriver chain.

## Description

Chain ID: 1285
Chain Name: Moonriver
Default Block Explorer: https://moonriver.moonscan.io
Default RPC URL: https://moonriver.public.blastapi.io

## Example

```ts
import { createMemoryClient } from 'tevm'
import { moonriver } from 'tevm/common'
import { http } from 'tevm'

const client = createMemoryClient({
  common: moonriver,
  fork: {
    transport: http({ url: 'https://example.com' })({})
  },
})
```
