[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [common](../README.md) / bscTestnet

# Variable: bscTestnet

> `const` **bscTestnet**: [`Common`](../type-aliases/Common.md)

Defined in: packages/common/types/presets/bscTestnet.d.ts:21

Creates a common configuration for the bscTestnet chain.

## Description

Chain ID: 97
Chain Name: Binance Smart Chain Testnet
Default Block Explorer: https://testnet.bscscan.com
Default RPC URL: https://data-seed-prebsc-1-s1.bnbchain.org:8545

## Example

```ts
import { createMemoryClient } from 'tevm'
import { bscTestnet } from 'tevm/common'
import { http } from 'tevm'

const client = createMemoryClient({
  common: bscTestnet,
  fork: {
    transport: http({ url: 'https://example.com' })({})
  },
})
```
