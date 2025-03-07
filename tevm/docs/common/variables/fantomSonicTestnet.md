[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [common](../README.md) / fantomSonicTestnet

# Variable: fantomSonicTestnet

> `const` **fantomSonicTestnet**: [`Common`](../type-aliases/Common.md)

Defined in: packages/common/types/presets/fantomSonicTestnet.d.ts:21

Creates a common configuration for the fantomSonicTestnet chain.

## Description

Chain ID: 64240
Chain Name: Fantom Sonic Open Testnet
Default Block Explorer: https://public-sonic.fantom.network
Default RPC URL: https://rpcapi.sonic.fantom.network

## Example

```ts
import { createMemoryClient } from 'tevm'
import { fantomSonicTestnet } from 'tevm/common'
import { http } from 'tevm'

const client = createMemoryClient({
  common: fantomSonicTestnet,
  fork: {
    transport: http({ url: 'https://example.com' })({})
  },
})
```
