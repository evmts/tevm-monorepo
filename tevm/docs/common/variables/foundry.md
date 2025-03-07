[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [common](../README.md) / foundry

# Variable: foundry

> `const` **foundry**: [`Common`](../type-aliases/Common.md)

Defined in: packages/common/types/presets/foundry.d.ts:21

Creates a common configuration for the foundry chain.

## Description

Chain ID: 31337
Chain Name: Foundry
Default Block Explorer: Not specified
Default RPC URL: http://127.0.0.1:8545

## Example

```ts
import { createMemoryClient } from 'tevm'
import { foundry } from 'tevm/common'
import { http } from 'tevm'

const client = createMemoryClient({
  common: foundry,
  fork: {
    transport: http({ url: 'https://example.com' })({})
  },
})
```
