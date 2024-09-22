[**tevm**](../../README.md) • **Docs**

***

[tevm](../../modules.md) / [common](../README.md) / bxnTestnet

# Variable: bxnTestnet

> `const` **bxnTestnet**: `Common`

Creates a common configuration for the bxnTestnet chain.

## Description

Chain ID: 4777
Chain Name: BlackFort Exchange Network Testnet
Default Block Explorer: https://testnet-explorer.blackfort.network
Default RPC URL: https://testnet.blackfort.network/rpc

## Example

```ts
import { createMemoryClient } from 'tevm'
import { bxnTestnet } from 'tevm/common'
import { http } from 'tevm'

const client = createMemoryClient({
  common: bxnTestnet,
  fork: {
    transport: http({ url: 'https://example.com' })({})
  },
})
```

## Defined in

packages/common/types/presets/bxnTestnet.d.ts:21
