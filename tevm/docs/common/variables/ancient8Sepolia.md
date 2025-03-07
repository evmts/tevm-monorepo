[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [common](../README.md) / ancient8Sepolia

# Variable: ancient8Sepolia

> `const` **ancient8Sepolia**: [`Common`](../type-aliases/Common.md)

Defined in: packages/common/types/presets/ancient8Sepolia.d.ts:21

Creates a common configuration for the ancient8Sepolia chain.

## Description

Chain ID: 28122024
Chain Name: Ancient8 Testnet
Default Block Explorer: https://scanv2-testnet.ancient8.gg
Default RPC URL: https://rpcv2-testnet.ancient8.gg

## Example

```ts
import { createMemoryClient } from 'tevm'
import { ancient8Sepolia } from 'tevm/common'
import { http } from 'tevm'

const client = createMemoryClient({
  common: ancient8Sepolia,
  fork: {
    transport: http({ url: 'https://example.com' })({})
  },
})
```
