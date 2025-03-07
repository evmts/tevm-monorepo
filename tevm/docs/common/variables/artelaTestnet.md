[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [common](../README.md) / artelaTestnet

# Variable: artelaTestnet

> `const` **artelaTestnet**: [`Common`](../type-aliases/Common.md)

Defined in: packages/common/types/presets/artelaTestnet.d.ts:21

Creates a common configuration for the artelaTestnet chain.

## Description

Chain ID: 11822
Chain Name: Artela Testnet
Default Block Explorer: https://betanet-scan.artela.network
Default RPC URL: https://betanet-rpc1.artela.network

## Example

```ts
import { createMemoryClient } from 'tevm'
import { artelaTestnet } from 'tevm/common'
import { http } from 'tevm'

const client = createMemoryClient({
  common: artelaTestnet,
  fork: {
    transport: http({ url: 'https://example.com' })({})
  },
})
```
