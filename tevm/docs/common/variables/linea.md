[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [common](../README.md) / linea

# Variable: linea

> `const` **linea**: [`Common`](../type-aliases/Common.md)

Defined in: packages/common/types/presets/linea.d.ts:21

Creates a common configuration for the linea chain.

## Description

Chain ID: 59144
Chain Name: Linea Mainnet
Default Block Explorer: https://lineascan.build
Default RPC URL: https://rpc.linea.build

## Example

```ts
import { createMemoryClient } from 'tevm'
import { linea } from 'tevm/common'
import { http } from 'tevm'

const client = createMemoryClient({
  common: linea,
  fork: {
    transport: http({ url: 'https://example.com' })({})
  },
})
```
