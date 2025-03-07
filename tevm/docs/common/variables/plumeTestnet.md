[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [common](../README.md) / plumeTestnet

# Variable: plumeTestnet

> `const` **plumeTestnet**: [`Common`](../type-aliases/Common.md)

Defined in: packages/common/types/presets/plumeTestnet.d.ts:21

Creates a common configuration for the plumeTestnet chain.

## Description

Chain ID: 161221135
Chain Name: Plume Testnet
Default Block Explorer: https://testnet-explorer.plumenetwork.xyz
Default RPC URL: https://testnet-rpc.plumenetwork.xyz/http

## Example

```ts
import { createMemoryClient } from 'tevm'
import { plumeTestnet } from 'tevm/common'
import { http } from 'tevm'

const client = createMemoryClient({
  common: plumeTestnet,
  fork: {
    transport: http({ url: 'https://example.com' })({})
  },
})
```
