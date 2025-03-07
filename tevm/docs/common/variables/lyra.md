[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [common](../README.md) / lyra

# Variable: lyra

> `const` **lyra**: [`Common`](../type-aliases/Common.md)

Defined in: packages/common/types/presets/lyra.d.ts:21

Creates a common configuration for the lyra chain.

## Description

Chain ID: 957
Chain Name: Lyra Chain
Default Block Explorer: https://explorer.lyra.finance
Default RPC URL: https://rpc.lyra.finance

## Example

```ts
import { createMemoryClient } from 'tevm'
import { lyra } from 'tevm/common'
import { http } from 'tevm'

const client = createMemoryClient({
  common: lyra,
  fork: {
    transport: http({ url: 'https://example.com' })({})
  },
})
```
