[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [common](../README.md) / zkFairTestnet

# Variable: zkFairTestnet

> `const` **zkFairTestnet**: [`Common`](../type-aliases/Common.md)

Defined in: packages/common/types/presets/zkFairTestnet.d.ts:21

Creates a common configuration for the zkFairTestnet chain.

## Description

Chain ID: 43851
Chain Name: ZKFair Testnet
Default Block Explorer: https://testnet-scan.zkfair.io
Default RPC URL: https://testnet-rpc.zkfair.io

## Example

```ts
import { createMemoryClient } from 'tevm'
import { zkFairTestnet } from 'tevm/common'
import { http } from 'tevm'

const client = createMemoryClient({
  common: zkFairTestnet,
  fork: {
    transport: http({ url: 'https://example.com' })({})
  },
})
```
