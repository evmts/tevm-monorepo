[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [common](../README.md) / avalancheFuji

# Variable: avalancheFuji

> `const` **avalancheFuji**: [`Common`](../type-aliases/Common.md)

Defined in: packages/common/types/presets/avalancheFuji.d.ts:21

Creates a common configuration for the avalancheFuji chain.

## Description

Chain ID: 43113
Chain Name: Avalanche Fuji
Default Block Explorer: https://testnet.snowtrace.io
Default RPC URL: https://api.avax-test.network/ext/bc/C/rpc

## Example

```ts
import { createMemoryClient } from 'tevm'
import { avalancheFuji } from 'tevm/common'
import { http } from 'tevm'

const client = createMemoryClient({
  common: avalancheFuji,
  fork: {
    transport: http({ url: 'https://example.com' })({})
  },
})
```
