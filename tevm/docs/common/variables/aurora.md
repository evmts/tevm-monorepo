[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [common](../README.md) / aurora

# Variable: aurora

> `const` **aurora**: [`Common`](../type-aliases/Common.md)

Defined in: packages/common/types/presets/aurora.d.ts:21

Creates a common configuration for the aurora chain.

## Description

Chain ID: 1313161554
Chain Name: Aurora
Default Block Explorer: https://aurorascan.dev
Default RPC URL: https://mainnet.aurora.dev

## Example

```ts
import { createMemoryClient } from 'tevm'
import { aurora } from 'tevm/common'
import { http } from 'tevm'

const client = createMemoryClient({
  common: aurora,
  fork: {
    transport: http({ url: 'https://example.com' })({})
  },
})
```
