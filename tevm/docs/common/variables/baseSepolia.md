[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [common](../README.md) / baseSepolia

# Variable: baseSepolia

> `const` **baseSepolia**: [`Common`](../type-aliases/Common.md)

Defined in: packages/common/types/presets/baseSepolia.d.ts:21

Creates a common configuration for the baseSepolia chain.

## Description

Chain ID: 84532
Chain Name: Base Sepolia
Default Block Explorer: https://sepolia.basescan.org
Default RPC URL: https://sepolia.base.org

## Example

```ts
import { createMemoryClient } from 'tevm'
import { baseSepolia } from 'tevm/common'
import { http } from 'tevm'

const client = createMemoryClient({
  common: baseSepolia,
  fork: {
    transport: http({ url: 'https://example.com' })({})
  },
})
```
