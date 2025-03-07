[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [common](../README.md) / morphSepolia

# Variable: morphSepolia

> `const` **morphSepolia**: [`Common`](../type-aliases/Common.md)

Defined in: packages/common/types/presets/morphSepolia.d.ts:21

Creates a common configuration for the morphSepolia chain.

## Description

Chain ID: 2710
Chain Name: Morph Sepolia
Default Block Explorer: https://explorer-testnet.morphl2.io
Default RPC URL: https://rpc-testnet.morphl2.io

## Example

```ts
import { createMemoryClient } from 'tevm'
import { morphSepolia } from 'tevm/common'
import { http } from 'tevm'

const client = createMemoryClient({
  common: morphSepolia,
  fork: {
    transport: http({ url: 'https://example.com' })({})
  },
})
```
