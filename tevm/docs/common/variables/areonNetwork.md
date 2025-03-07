[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [common](../README.md) / areonNetwork

# Variable: areonNetwork

> `const` **areonNetwork**: [`Common`](../type-aliases/Common.md)

Defined in: packages/common/types/presets/areonNetwork.d.ts:21

Creates a common configuration for the areonNetwork chain.

## Description

Chain ID: 463
Chain Name: Areon Network
Default Block Explorer: https://areonscan.com
Default RPC URL: https://mainnet-rpc.areon.network

## Example

```ts
import { createMemoryClient } from 'tevm'
import { areonNetwork } from 'tevm/common'
import { http } from 'tevm'

const client = createMemoryClient({
  common: areonNetwork,
  fork: {
    transport: http({ url: 'https://example.com' })({})
  },
})
```
