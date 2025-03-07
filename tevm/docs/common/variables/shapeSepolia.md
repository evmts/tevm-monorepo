[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [common](../README.md) / shapeSepolia

# Variable: shapeSepolia

> `const` **shapeSepolia**: [`Common`](../type-aliases/Common.md)

Defined in: packages/common/types/presets/shapeSepolia.d.ts:21

Creates a common configuration for the shapeSepolia chain.

## Description

Chain ID: 11011
Chain Name: Shape Sepolia Testnet
Default Block Explorer: https://shape-sepolia-explorer.alchemy.com
Default RPC URL: https://sepolia.shape.network

## Example

```ts
import { createMemoryClient } from 'tevm'
import { shapeSepolia } from 'tevm/common'
import { http } from 'tevm'

const client = createMemoryClient({
  common: shapeSepolia,
  fork: {
    transport: http({ url: 'https://example.com' })({})
  },
})
```
