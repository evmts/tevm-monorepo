[**tevm**](../../README.md) • **Docs**

***

[tevm](../../modules.md) / [common](../README.md) / rootstockTestnet

# Variable: rootstockTestnet

> `const` **rootstockTestnet**: `Common`

Creates a common configuration for the rootstockTestnet chain.

## Description

Chain ID: 31
Chain Name: Rootstock Testnet
Default Block Explorer: https://explorer.testnet.rootstock.io
Default RPC URL: https://public-node.testnet.rsk.co

## Example

```ts
import { createMemoryClient } from 'tevm'
import { rootstockTestnet } from 'tevm/common'
import { http } from 'tevm'

const client = createMemoryClient({
  common: rootstockTestnet,
  fork: {
    transport: http({ url: 'https://example.com' })({})
  },
})
```

## Defined in

packages/common/types/presets/rootstockTestnet.d.ts:21
