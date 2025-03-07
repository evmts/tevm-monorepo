[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [common](../README.md) / b3Sepolia

# Variable: b3Sepolia

> `const` **b3Sepolia**: [`Common`](../type-aliases/Common.md)

Defined in: packages/common/types/presets/b3Sepolia.d.ts:21

Creates a common configuration for the b3Sepolia chain.

## Description

Chain ID: 1993
Chain Name: B3 Sepolia
Default Block Explorer: https://sepolia.explorer.b3.fun
Default RPC URL: https://sepolia.b3.fun/http

## Example

```ts
import { createMemoryClient } from 'tevm'
import { b3Sepolia } from 'tevm/common'
import { http } from 'tevm'

const client = createMemoryClient({
  common: b3Sepolia,
  fork: {
    transport: http({ url: 'https://example.com' })({})
  },
})
```
