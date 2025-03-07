[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [common](../README.md) / iotex

# Variable: iotex

> `const` **iotex**: [`Common`](../type-aliases/Common.md)

Defined in: packages/common/types/presets/iotex.d.ts:21

Creates a common configuration for the iotex chain.

## Description

Chain ID: 4689
Chain Name: IoTeX
Default Block Explorer: https://iotexscan.io
Default RPC URL: https://babel-api.mainnet.iotex.io

## Example

```ts
import { createMemoryClient } from 'tevm'
import { iotex } from 'tevm/common'
import { http } from 'tevm'

const client = createMemoryClient({
  common: iotex,
  fork: {
    transport: http({ url: 'https://example.com' })({})
  },
})
```
