[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [common](../README.md) / moonbeam

# Variable: moonbeam

> `const` **moonbeam**: [`Common`](../type-aliases/Common.md)

Defined in: packages/common/types/presets/moonbeam.d.ts:21

Creates a common configuration for the moonbeam chain.

## Description

Chain ID: 1284
Chain Name: Moonbeam
Default Block Explorer: https://moonscan.io
Default RPC URL: https://moonbeam.public.blastapi.io

## Example

```ts
import { createMemoryClient } from 'tevm'
import { moonbeam } from 'tevm/common'
import { http } from 'tevm'

const client = createMemoryClient({
  common: moonbeam,
  fork: {
    transport: http({ url: 'https://example.com' })({})
  },
})
```
