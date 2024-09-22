[**tevm**](../../README.md) • **Docs**

***

[tevm](../../modules.md) / [common](../README.md) / mantleTestnet

# Variable: mantleTestnet

> `const` **mantleTestnet**: `Common`

Creates a common configuration for the mantleTestnet chain.

## Description

Chain ID: 5001
Chain Name: Mantle Testnet
Default Block Explorer: https://explorer.testnet.mantle.xyz
Default RPC URL: https://rpc.testnet.mantle.xyz

## Example

```ts
import { createMemoryClient } from 'tevm'
import { mantleTestnet } from 'tevm/common'
import { http } from 'tevm'

const client = createMemoryClient({
  common: mantleTestnet,
  fork: {
    transport: http({ url: 'https://example.com' })({})
  },
})
```

## Defined in

packages/common/types/presets/mantleTestnet.d.ts:21
