[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [common](../README.md) / lineaSepolia

# Variable: lineaSepolia

> `const` **lineaSepolia**: [`Common`](../type-aliases/Common.md)

Defined in: packages/common/types/presets/lineaSepolia.d.ts:21

Creates a common configuration for the lineaSepolia chain.

## Description

Chain ID: 59141
Chain Name: Linea Sepolia Testnet
Default Block Explorer: https://sepolia.lineascan.build
Default RPC URL: https://rpc.sepolia.linea.build

## Example

```ts
import { createMemoryClient } from 'tevm'
import { lineaSepolia } from 'tevm/common'
import { http } from 'tevm'

const client = createMemoryClient({
  common: lineaSepolia,
  fork: {
    transport: http({ url: 'https://example.com' })({})
  },
})
```
