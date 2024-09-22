[**tevm**](../../README.md) • **Docs**

***

[tevm](../../modules.md) / [common](../README.md) / fraxtalTestnet

# Variable: fraxtalTestnet

> `const` **fraxtalTestnet**: `Common`

Creates a common configuration for the fraxtalTestnet chain.

## Description

Chain ID: 2522
Chain Name: Fraxtal Testnet
Default Block Explorer: https://holesky.fraxscan.com
Default RPC URL: https://rpc.testnet.frax.com

## Example

```ts
import { createMemoryClient } from 'tevm'
import { fraxtalTestnet } from 'tevm/common'
import { http } from 'tevm'

const client = createMemoryClient({
  common: fraxtalTestnet,
  fork: {
    transport: http({ url: 'https://example.com' })({})
  },
})
```

## Defined in

packages/common/types/presets/fraxtalTestnet.d.ts:21
