[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [common](../README.md) / spicy

# Variable: spicy

> `const` **spicy**: [`Common`](../type-aliases/Common.md)

Defined in: packages/common/types/presets/spicy.d.ts:21

Creates a common configuration for the spicy chain.

## Description

Chain ID: 88882
Chain Name: Chiliz Spicy Testnet
Default Block Explorer: http://spicy-explorer.chiliz.com
Default RPC URL: https://spicy-rpc.chiliz.com

## Example

```ts
import { createMemoryClient } from 'tevm'
import { spicy } from 'tevm/common'
import { http } from 'tevm'

const client = createMemoryClient({
  common: spicy,
  fork: {
    transport: http({ url: 'https://example.com' })({})
  },
})
```
