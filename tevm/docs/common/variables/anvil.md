[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [common](../README.md) / anvil

# Variable: anvil

> `const` **anvil**: [`Common`](../type-aliases/Common.md)

Defined in: packages/common/types/presets/anvil.d.ts:21

Creates a common configuration for the anvil chain.

## Description

Chain ID: 31337
Chain Name: Anvil
Default Block Explorer: Not specified
Default RPC URL: http://127.0.0.1:8545

## Example

```ts
import { createMemoryClient } from 'tevm'
import { anvil } from 'tevm/common'
import { http } from 'tevm'

const client = createMemoryClient({
  common: anvil,
  fork: {
    transport: http({ url: 'https://example.com' })({})
  },
})
```
