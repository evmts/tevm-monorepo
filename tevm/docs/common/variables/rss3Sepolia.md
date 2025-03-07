[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [common](../README.md) / rss3Sepolia

# Variable: rss3Sepolia

> `const` **rss3Sepolia**: [`Common`](../type-aliases/Common.md)

Defined in: packages/common/types/presets/rss3Sepolia.d.ts:21

Creates a common configuration for the rss3Sepolia chain.

## Description

Chain ID: 2331
Chain Name: RSS3 VSL Sepolia Testnet
Default Block Explorer: https://scan.testnet.rss3.io
Default RPC URL: https://rpc.testnet.rss3.io

## Example

```ts
import { createMemoryClient } from 'tevm'
import { rss3Sepolia } from 'tevm/common'
import { http } from 'tevm'

const client = createMemoryClient({
  common: rss3Sepolia,
  fork: {
    transport: http({ url: 'https://example.com' })({})
  },
})
```
