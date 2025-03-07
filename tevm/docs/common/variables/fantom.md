[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [common](../README.md) / fantom

# Variable: fantom

> `const` **fantom**: [`Common`](../type-aliases/Common.md)

Defined in: packages/common/types/presets/fantom.d.ts:21

Creates a common configuration for the fantom chain.

## Description

Chain ID: 250
Chain Name: Fantom
Default Block Explorer: https://ftmscan.com
Default RPC URL: https://rpc.ankr.com/fantom

## Example

```ts
import { createMemoryClient } from 'tevm'
import { fantom } from 'tevm/common'
import { http } from 'tevm'

const client = createMemoryClient({
  common: fantom,
  fork: {
    transport: http({ url: 'https://example.com' })({})
  },
})
```
