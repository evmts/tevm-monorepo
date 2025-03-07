[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [common](../README.md) / satoshiVM

# Variable: satoshiVM

> `const` **satoshiVM**: [`Common`](../type-aliases/Common.md)

Defined in: packages/common/types/presets/satoshiVM.d.ts:21

Creates a common configuration for the satoshiVM chain.

## Description

Chain ID: 3109
Chain Name: SatoshiVM Alpha Mainnet
Default Block Explorer: https://svmscan.io
Default RPC URL: https://alpha-rpc-node-http.svmscan.io

## Example

```ts
import { createMemoryClient } from 'tevm'
import { satoshiVM } from 'tevm/common'
import { http } from 'tevm'

const client = createMemoryClient({
  common: satoshiVM,
  fork: {
    transport: http({ url: 'https://example.com' })({})
  },
})
```
