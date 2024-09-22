[**tevm**](../../README.md) • **Docs**

***

[tevm](../../modules.md) / [common](../README.md) / mantleSepoliaTestnet

# Variable: mantleSepoliaTestnet

> `const` **mantleSepoliaTestnet**: `Common`

Creates a common configuration for the mantleSepoliaTestnet chain.

## Description

Chain ID: 5003
Chain Name: Mantle Sepolia Testnet
Default Block Explorer: https://explorer.sepolia.mantle.xyz/
Default RPC URL: https://rpc.sepolia.mantle.xyz

## Example

```ts
import { createMemoryClient } from 'tevm'
import { mantleSepoliaTestnet } from 'tevm/common'
import { http } from 'tevm'

const client = createMemoryClient({
  common: mantleSepoliaTestnet,
  fork: {
    transport: http({ url: 'https://example.com' })({})
  },
})
```

## Defined in

packages/common/types/presets/mantleSepoliaTestnet.d.ts:21
