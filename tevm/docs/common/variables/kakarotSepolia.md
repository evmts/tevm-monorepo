[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [common](../README.md) / kakarotSepolia

# Variable: kakarotSepolia

> `const` **kakarotSepolia**: [`Common`](../type-aliases/Common.md)

Defined in: packages/common/types/presets/kakarotSepolia.d.ts:21

Creates a common configuration for the kakarotSepolia chain.

## Description

Chain ID: 1802203764
Chain Name: Kakarot Sepolia
Default Block Explorer: https://sepolia.kakarotscan.org
Default RPC URL: https://sepolia-rpc.kakarot.org

## Example

```ts
import { createMemoryClient } from 'tevm'
import { kakarotSepolia } from 'tevm/common'
import { http } from 'tevm'

const client = createMemoryClient({
  common: kakarotSepolia,
  fork: {
    transport: http({ url: 'https://example.com' })({})
  },
})
```
