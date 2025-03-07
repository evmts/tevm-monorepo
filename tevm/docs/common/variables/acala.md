[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [common](../README.md) / acala

# Variable: acala

> `const` **acala**: [`Common`](../type-aliases/Common.md)

Defined in: packages/common/types/presets/acala.d.ts:21

Creates a common configuration for the acala chain.

## Description

Chain ID: 787
Chain Name: Acala
Default Block Explorer: https://blockscout.acala.network
Default RPC URL: https://eth-rpc-acala.aca-api.network

## Example

```ts
import { createMemoryClient } from 'tevm'
import { acala } from 'tevm/common'
import { http } from 'tevm'

const client = createMemoryClient({
  common: acala,
  fork: {
    transport: http({ url: 'https://example.com' })({})
  },
})
```
