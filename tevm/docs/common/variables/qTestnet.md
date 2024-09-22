[**tevm**](../../README.md) • **Docs**

***

[tevm](../../modules.md) / [common](../README.md) / qTestnet

# Variable: qTestnet

> `const` **qTestnet**: `Common`

Creates a common configuration for the qTestnet chain.

## Description

Chain ID: 35443
Chain Name: Q Testnet
Default Block Explorer: https://explorer.qtestnet.org
Default RPC URL: https://rpc.qtestnet.org

## Example

```ts
import { createMemoryClient } from 'tevm'
import { qTestnet } from 'tevm/common'
import { http } from 'tevm'

const client = createMemoryClient({
  common: qTestnet,
  fork: {
    transport: http({ url: 'https://example.com' })({})
  },
})
```

## Defined in

packages/common/types/presets/qTestnet.d.ts:21
