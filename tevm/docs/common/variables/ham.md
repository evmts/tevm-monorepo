[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [common](../README.md) / ham

# Variable: ham

> `const` **ham**: [`Common`](../type-aliases/Common.md)

Defined in: packages/common/types/presets/ham.d.ts:21

Creates a common configuration for the ham chain.

## Description

Chain ID: 5112
Chain Name: Ham
Default Block Explorer: https://explorer.ham.fun
Default RPC URL: https://rpc.ham.fun

## Example

```ts
import { createMemoryClient } from 'tevm'
import { ham } from 'tevm/common'
import { http } from 'tevm'

const client = createMemoryClient({
  common: ham,
  fork: {
    transport: http({ url: 'https://example.com' })({})
  },
})
```
