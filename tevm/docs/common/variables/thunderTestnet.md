[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [common](../README.md) / thunderTestnet

# Variable: thunderTestnet

> `const` **thunderTestnet**: [`Common`](../type-aliases/Common.md)

Defined in: packages/common/types/presets/thunderTestnet.d.ts:21

Creates a common configuration for the thunderTestnet chain.

## Description

Chain ID: 997
Chain Name: 5ireChain Thunder Testnet
Default Block Explorer: https://explorer.5ire.network
Default RPC URL: https://rpc-testnet.5ire.network

## Example

```ts
import { createMemoryClient } from 'tevm'
import { thunderTestnet } from 'tevm/common'
import { http } from 'tevm'

const client = createMemoryClient({
  common: thunderTestnet,
  fork: {
    transport: http({ url: 'https://example.com' })({})
  },
})
```
