[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [common](../README.md) / sepolia

# Variable: sepolia

> `const` **sepolia**: [`Common`](../type-aliases/Common.md)

Defined in: packages/common/types/presets/sepolia.d.ts:21

Creates a common configuration for the sepolia chain.

## Description

Chain ID: 11155111
Chain Name: Sepolia
Default Block Explorer: https://sepolia.etherscan.io
Default RPC URL: https://rpc.sepolia.org

## Example

```ts
import { createMemoryClient } from 'tevm'
import { sepolia } from 'tevm/common'
import { http } from 'tevm'

const client = createMemoryClient({
  common: sepolia,
  fork: {
    transport: http({ url: 'https://example.com' })({})
  },
})
```
