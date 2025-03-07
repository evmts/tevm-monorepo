[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [common](../README.md) / sapphireTestnet

# Variable: sapphireTestnet

> `const` **sapphireTestnet**: [`Common`](../type-aliases/Common.md)

Defined in: packages/common/types/presets/sapphireTestnet.d.ts:21

Creates a common configuration for the sapphireTestnet chain.

## Description

Chain ID: 23295
Chain Name: Oasis Sapphire Testnet
Default Block Explorer: https://explorer.oasis.io/testnet/sapphire
Default RPC URL: https://testnet.sapphire.oasis.dev

## Example

```ts
import { createMemoryClient } from 'tevm'
import { sapphireTestnet } from 'tevm/common'
import { http } from 'tevm'

const client = createMemoryClient({
  common: sapphireTestnet,
  fork: {
    transport: http({ url: 'https://example.com' })({})
  },
})
```
