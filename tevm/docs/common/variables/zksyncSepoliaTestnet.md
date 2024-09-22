[**tevm**](../../README.md) • **Docs**

***

[tevm](../../modules.md) / [common](../README.md) / zksyncSepoliaTestnet

# Variable: zksyncSepoliaTestnet

> `const` **zksyncSepoliaTestnet**: `Common`

Creates a common configuration for the zksyncSepoliaTestnet chain.

## Description

Chain ID: 300
Chain Name: ZKsync Sepolia Testnet
Default Block Explorer: https://sepolia-era.zksync.network/
Default RPC URL: https://sepolia.era.zksync.dev

## Example

```ts
import { createMemoryClient } from 'tevm'
import { zksyncSepoliaTestnet } from 'tevm/common'
import { http } from 'tevm'

const client = createMemoryClient({
  common: zksyncSepoliaTestnet,
  fork: {
    transport: http({ url: 'https://example.com' })({})
  },
})
```

## Defined in

packages/common/types/presets/zksyncSepoliaTestnet.d.ts:21
