[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [common](../README.md) / pgnTestnet

# Variable: pgnTestnet

> `const` **pgnTestnet**: [`Common`](../type-aliases/Common.md)

Defined in: packages/common/types/presets/pgnTestnet.d.ts:21

Creates a common configuration for the pgnTestnet chain.

## Description

Chain ID: 58008
Chain Name: PGN
Default Block Explorer: https://explorer.sepolia.publicgoods.network
Default RPC URL: https://sepolia.publicgoods.network

## Example

```ts
import { createMemoryClient } from 'tevm'
import { pgnTestnet } from 'tevm/common'
import { http } from 'tevm'

const client = createMemoryClient({
  common: pgnTestnet,
  fork: {
    transport: http({ url: 'https://example.com' })({})
  },
})
```
