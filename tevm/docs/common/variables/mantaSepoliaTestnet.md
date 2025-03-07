[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [common](../README.md) / mantaSepoliaTestnet

# Variable: mantaSepoliaTestnet

> `const` **mantaSepoliaTestnet**: [`Common`](../type-aliases/Common.md)

Defined in: packages/common/types/presets/mantaSepoliaTestnet.d.ts:21

Creates a common configuration for the mantaSepoliaTestnet chain.

## Description

Chain ID: 3441006
Chain Name: Manta Pacific Sepolia Testnet
Default Block Explorer: https://pacific-explorer.sepolia-testnet.manta.network
Default RPC URL: https://pacific-rpc.sepolia-testnet.manta.network/http

## Example

```ts
import { createMemoryClient } from 'tevm'
import { mantaSepoliaTestnet } from 'tevm/common'
import { http } from 'tevm'

const client = createMemoryClient({
  common: mantaSepoliaTestnet,
  fork: {
    transport: http({ url: 'https://example.com' })({})
  },
})
```
