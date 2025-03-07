[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [common](../README.md) / liskSepolia

# Variable: liskSepolia

> `const` **liskSepolia**: [`Common`](../type-aliases/Common.md)

Defined in: packages/common/types/presets/liskSepolia.d.ts:21

Creates a common configuration for the liskSepolia chain.

## Description

Chain ID: 4202
Chain Name: Lisk Sepolia
Default Block Explorer: https://sepolia-blockscout.lisk.com
Default RPC URL: https://rpc.sepolia-api.lisk.com

## Example

```ts
import { createMemoryClient } from 'tevm'
import { liskSepolia } from 'tevm/common'
import { http } from 'tevm'

const client = createMemoryClient({
  common: liskSepolia,
  fork: {
    transport: http({ url: 'https://example.com' })({})
  },
})
```
