[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [common](../README.md) / optimismSepolia

# Variable: optimismSepolia

> `const` **optimismSepolia**: [`Common`](../type-aliases/Common.md)

Defined in: packages/common/types/presets/optimismSepolia.d.ts:21

Creates a common configuration for the optimismSepolia chain.

## Description

Chain ID: 11155420
Chain Name: OP Sepolia
Default Block Explorer: https://optimism-sepolia.blockscout.com
Default RPC URL: https://sepolia.optimism.io

## Example

```ts
import { createMemoryClient } from 'tevm'
import { optimismSepolia } from 'tevm/common'
import { http } from 'tevm'

const client = createMemoryClient({
  common: optimismSepolia,
  fork: {
    transport: http({ url: 'https://example.com' })({})
  },
})
```
