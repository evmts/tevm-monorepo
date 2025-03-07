[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [common](../README.md) / telcoinTestnet

# Variable: telcoinTestnet

> `const` **telcoinTestnet**: [`Common`](../type-aliases/Common.md)

Defined in: packages/common/types/presets/telcoinTestnet.d.ts:21

Creates a common configuration for the telcoinTestnet chain.

## Description

Chain ID: 2017
Chain Name: Telcoin Adiri Testnet
Default Block Explorer: https://telscan.io
Default RPC URL: https://rpc.telcoin.network

## Example

```ts
import { createMemoryClient } from 'tevm'
import { telcoinTestnet } from 'tevm/common'
import { http } from 'tevm'

const client = createMemoryClient({
  common: telcoinTestnet,
  fork: {
    transport: http({ url: 'https://example.com' })({})
  },
})
```
