[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [common](../README.md) / darwinia

# Variable: darwinia

> `const` **darwinia**: [`Common`](../type-aliases/Common.md)

Defined in: packages/common/types/presets/darwinia.d.ts:21

Creates a common configuration for the darwinia chain.

## Description

Chain ID: 46
Chain Name: Darwinia Network
Default Block Explorer: https://explorer.darwinia.network
Default RPC URL: https://rpc.darwinia.network

## Example

```ts
import { createMemoryClient } from 'tevm'
import { darwinia } from 'tevm/common'
import { http } from 'tevm'

const client = createMemoryClient({
  common: darwinia,
  fork: {
    transport: http({ url: 'https://example.com' })({})
  },
})
```
