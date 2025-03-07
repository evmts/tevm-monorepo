[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [common](../README.md) / areonNetworkTestnet

# Variable: areonNetworkTestnet

> `const` **areonNetworkTestnet**: [`Common`](../type-aliases/Common.md)

Defined in: packages/common/types/presets/areonNetworkTestnet.d.ts:21

Creates a common configuration for the areonNetworkTestnet chain.

## Description

Chain ID: 462
Chain Name: Areon Network Testnet
Default Block Explorer: https://areonscan.com
Default RPC URL: https://testnet-rpc.areon.network

## Example

```ts
import { createMemoryClient } from 'tevm'
import { areonNetworkTestnet } from 'tevm/common'
import { http } from 'tevm'

const client = createMemoryClient({
  common: areonNetworkTestnet,
  fork: {
    transport: http({ url: 'https://example.com' })({})
  },
})
```
