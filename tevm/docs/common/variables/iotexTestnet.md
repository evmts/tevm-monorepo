[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [common](../README.md) / iotexTestnet

# Variable: iotexTestnet

> `const` **iotexTestnet**: [`Common`](../type-aliases/Common.md)

Defined in: packages/common/types/presets/iotexTestnet.d.ts:21

Creates a common configuration for the iotexTestnet chain.

## Description

Chain ID: 4690
Chain Name: IoTeX Testnet
Default Block Explorer: https://testnet.iotexscan.io
Default RPC URL: https://babel-api.testnet.iotex.io

## Example

```ts
import { createMemoryClient } from 'tevm'
import { iotexTestnet } from 'tevm/common'
import { http } from 'tevm'

const client = createMemoryClient({
  common: iotexTestnet,
  fork: {
    transport: http({ url: 'https://example.com' })({})
  },
})
```
