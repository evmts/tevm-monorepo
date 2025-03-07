[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [common](../README.md) / karura

# Variable: karura

> `const` **karura**: [`Common`](../type-aliases/Common.md)

Defined in: packages/common/types/presets/karura.d.ts:21

Creates a common configuration for the karura chain.

## Description

Chain ID: 686
Chain Name: Karura
Default Block Explorer: https://blockscout.karura.network
Default RPC URL: https://eth-rpc-karura.aca-api.network

## Example

```ts
import { createMemoryClient } from 'tevm'
import { karura } from 'tevm/common'
import { http } from 'tevm'

const client = createMemoryClient({
  common: karura,
  fork: {
    transport: http({ url: 'https://example.com' })({})
  },
})
```
