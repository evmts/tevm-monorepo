[**tevm**](../../README.md) • **Docs**

***

[tevm](../../modules.md) / [common](../README.md) / bitkubTestnet

# Variable: bitkubTestnet

> `const` **bitkubTestnet**: `Common`

Creates a common configuration for the bitkubTestnet chain.

## Description

Chain ID: 25925
Chain Name: Bitkub Testnet
Default Block Explorer: https://testnet.bkcscan.com
Default RPC URL: https://rpc-testnet.bitkubchain.io

## Example

```ts
import { createMemoryClient } from 'tevm'
import { bitkubTestnet } from 'tevm/common'
import { http } from 'tevm'

const client = createMemoryClient({
  common: bitkubTestnet,
  fork: {
    transport: http({ url: 'https://example.com' })({})
  },
})
```

## Defined in

packages/common/types/presets/bitkubTestnet.d.ts:21
