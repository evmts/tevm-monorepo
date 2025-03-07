[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [common](../README.md) / bobaSepolia

# Variable: bobaSepolia

> `const` **bobaSepolia**: [`Common`](../type-aliases/Common.md)

Defined in: packages/common/types/presets/bobaSepolia.d.ts:21

Creates a common configuration for the bobaSepolia chain.

## Description

Chain ID: 28882
Chain Name: Boba Sepolia
Default Block Explorer: https://testnet.bobascan.com
Default RPC URL: https://sepolia.boba.network

## Example

```ts
import { createMemoryClient } from 'tevm'
import { bobaSepolia } from 'tevm/common'
import { http } from 'tevm'

const client = createMemoryClient({
  common: bobaSepolia,
  fork: {
    transport: http({ url: 'https://example.com' })({})
  },
})
```
