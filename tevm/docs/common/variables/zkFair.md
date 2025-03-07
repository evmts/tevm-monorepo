[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [common](../README.md) / zkFair

# Variable: zkFair

> `const` **zkFair**: [`Common`](../type-aliases/Common.md)

Defined in: packages/common/types/presets/zkFair.d.ts:21

Creates a common configuration for the zkFair chain.

## Description

Chain ID: 42766
Chain Name: ZKFair Mainnet
Default Block Explorer: https://scan.zkfair.io
Default RPC URL: https://rpc.zkfair.io

## Example

```ts
import { createMemoryClient } from 'tevm'
import { zkFair } from 'tevm/common'
import { http } from 'tevm'

const client = createMemoryClient({
  common: zkFair,
  fork: {
    transport: http({ url: 'https://example.com' })({})
  },
})
```
