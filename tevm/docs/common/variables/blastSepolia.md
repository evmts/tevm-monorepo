[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [common](../README.md) / blastSepolia

# Variable: blastSepolia

> `const` **blastSepolia**: [`Common`](../type-aliases/Common.md)

Defined in: packages/common/types/presets/blastSepolia.d.ts:21

Creates a common configuration for the blastSepolia chain.

## Description

Chain ID: 168587773
Chain Name: Blast Sepolia
Default Block Explorer: https://sepolia.blastscan.io
Default RPC URL: https://sepolia.blast.io

## Example

```ts
import { createMemoryClient } from 'tevm'
import { blastSepolia } from 'tevm/common'
import { http } from 'tevm'

const client = createMemoryClient({
  common: blastSepolia,
  fork: {
    transport: http({ url: 'https://example.com' })({})
  },
})
```
