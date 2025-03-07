[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [common](../README.md) / mantaTestnet

# Variable: mantaTestnet

> `const` **mantaTestnet**: [`Common`](../type-aliases/Common.md)

Defined in: packages/common/types/presets/mantaTestnet.d.ts:21

Creates a common configuration for the mantaTestnet chain.

## Description

Chain ID: 3441005
Chain Name: Manta Pacific Testnet
Default Block Explorer: https://pacific-explorer.testnet.manta.network
Default RPC URL: https://manta-testnet.calderachain.xyz/http

## Example

```ts
import { createMemoryClient } from 'tevm'
import { mantaTestnet } from 'tevm/common'
import { http } from 'tevm'

const client = createMemoryClient({
  common: mantaTestnet,
  fork: {
    transport: http({ url: 'https://example.com' })({})
  },
})
```
