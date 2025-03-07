[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [common](../README.md) / auroria

# Variable: auroria

> `const` **auroria**: [`Common`](../type-aliases/Common.md)

Defined in: packages/common/types/presets/auroria.d.ts:21

Creates a common configuration for the auroria chain.

## Description

Chain ID: 205205
Chain Name: Auroria Testnet
Default Block Explorer: https://auroria.explorer.stratisevm.com
Default RPC URL: https://auroria.rpc.stratisevm.com

## Example

```ts
import { createMemoryClient } from 'tevm'
import { auroria } from 'tevm/common'
import { http } from 'tevm'

const client = createMemoryClient({
  common: auroria,
  fork: {
    transport: http({ url: 'https://example.com' })({})
  },
})
```
