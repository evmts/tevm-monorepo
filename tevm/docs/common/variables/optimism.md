[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [common](../README.md) / optimism

# Variable: optimism

> `const` **optimism**: [`Common`](../type-aliases/Common.md)

Defined in: packages/common/types/presets/optimism.d.ts:21

Creates a common configuration for the optimism chain.

## Description

Chain ID: 10
Chain Name: OP Mainnet
Default Block Explorer: https://optimistic.etherscan.io
Default RPC URL: https://mainnet.optimism.io

## Example

```ts
import { createMemoryClient } from 'tevm'
import { optimism } from 'tevm/common'
import { http } from 'tevm'

const client = createMemoryClient({
  common: optimism,
  fork: {
    transport: http({ url: 'https://example.com' })({})
  },
})
```
