[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [common](../README.md) / bxn

# Variable: bxn

> `const` **bxn**: [`Common`](../type-aliases/Common.md)

Defined in: packages/common/types/presets/bxn.d.ts:21

Creates a common configuration for the bxn chain.

## Description

Chain ID: 4999
Chain Name: BlackFort Exchange Network
Default Block Explorer: https://explorer.blackfort.network
Default RPC URL: https://mainnet.blackfort.network/rpc

## Example

```ts
import { createMemoryClient } from 'tevm'
import { bxn } from 'tevm/common'
import { http } from 'tevm'

const client = createMemoryClient({
  common: bxn,
  fork: {
    transport: http({ url: 'https://example.com' })({})
  },
})
```
