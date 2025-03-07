[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [common](../README.md) / crab

# Variable: crab

> `const` **crab**: [`Common`](../type-aliases/Common.md)

Defined in: packages/common/types/presets/crab.d.ts:21

Creates a common configuration for the crab chain.

## Description

Chain ID: 44
Chain Name: Crab Network
Default Block Explorer: https://crab-scan.darwinia.network
Default RPC URL: https://crab-rpc.darwinia.network

## Example

```ts
import { createMemoryClient } from 'tevm'
import { crab } from 'tevm/common'
import { http } from 'tevm'

const client = createMemoryClient({
  common: crab,
  fork: {
    transport: http({ url: 'https://example.com' })({})
  },
})
```
