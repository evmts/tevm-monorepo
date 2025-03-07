[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [common](../README.md) / scrollSepolia

# Variable: scrollSepolia

> `const` **scrollSepolia**: [`Common`](../type-aliases/Common.md)

Defined in: packages/common/types/presets/scrollSepolia.d.ts:21

Creates a common configuration for the scrollSepolia chain.

## Description

Chain ID: 534351
Chain Name: Scroll Sepolia
Default Block Explorer: https://sepolia.scrollscan.com
Default RPC URL: https://sepolia-rpc.scroll.io

## Example

```ts
import { createMemoryClient } from 'tevm'
import { scrollSepolia } from 'tevm/common'
import { http } from 'tevm'

const client = createMemoryClient({
  common: scrollSepolia,
  fork: {
    transport: http({ url: 'https://example.com' })({})
  },
})
```
