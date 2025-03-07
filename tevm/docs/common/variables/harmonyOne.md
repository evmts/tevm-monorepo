[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [common](../README.md) / harmonyOne

# Variable: harmonyOne

> `const` **harmonyOne**: [`Common`](../type-aliases/Common.md)

Defined in: packages/common/types/presets/harmonyOne.d.ts:21

Creates a common configuration for the harmonyOne chain.

## Description

Chain ID: 1666600000
Chain Name: Harmony One
Default Block Explorer: https://explorer.harmony.one
Default RPC URL: https://rpc.ankr.com/harmony

## Example

```ts
import { createMemoryClient } from 'tevm'
import { harmonyOne } from 'tevm/common'
import { http } from 'tevm'

const client = createMemoryClient({
  common: harmonyOne,
  fork: {
    transport: http({ url: 'https://example.com' })({})
  },
})
```
