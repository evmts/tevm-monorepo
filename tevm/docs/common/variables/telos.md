[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [common](../README.md) / telos

# Variable: telos

> `const` **telos**: [`Common`](../type-aliases/Common.md)

Defined in: packages/common/types/presets/telos.d.ts:21

Creates a common configuration for the telos chain.

## Description

Chain ID: 40
Chain Name: Telos
Default Block Explorer: https://www.teloscan.io/
Default RPC URL: https://mainnet.telos.net/evm

## Example

```ts
import { createMemoryClient } from 'tevm'
import { telos } from 'tevm/common'
import { http } from 'tevm'

const client = createMemoryClient({
  common: telos,
  fork: {
    transport: http({ url: 'https://example.com' })({})
  },
})
```
