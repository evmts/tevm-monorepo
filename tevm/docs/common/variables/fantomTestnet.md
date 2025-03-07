[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [common](../README.md) / fantomTestnet

# Variable: fantomTestnet

> `const` **fantomTestnet**: [`Common`](../type-aliases/Common.md)

Defined in: packages/common/types/presets/fantomTestnet.d.ts:21

Creates a common configuration for the fantomTestnet chain.

## Description

Chain ID: 4002
Chain Name: Fantom Testnet
Default Block Explorer: https://testnet.ftmscan.com
Default RPC URL: https://rpc.testnet.fantom.network

## Example

```ts
import { createMemoryClient } from 'tevm'
import { fantomTestnet } from 'tevm/common'
import { http } from 'tevm'

const client = createMemoryClient({
  common: fantomTestnet,
  fork: {
    transport: http({ url: 'https://example.com' })({})
  },
})
```
