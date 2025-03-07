[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [common](../README.md) / dfk

# Variable: dfk

> `const` **dfk**: [`Common`](../type-aliases/Common.md)

Defined in: packages/common/types/presets/dfk.d.ts:21

Creates a common configuration for the dfk chain.

## Description

Chain ID: 53935
Chain Name: DFK Chain
Default Block Explorer: https://subnets.avax.network/defi-kingdoms
Default RPC URL: https://subnets.avax.network/defi-kingdoms/dfk-chain/rpc

## Example

```ts
import { createMemoryClient } from 'tevm'
import { dfk } from 'tevm/common'
import { http } from 'tevm'

const client = createMemoryClient({
  common: dfk,
  fork: {
    transport: http({ url: 'https://example.com' })({})
  },
})
```
