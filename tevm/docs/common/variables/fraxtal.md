[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [common](../README.md) / fraxtal

# Variable: fraxtal

> `const` **fraxtal**: [`Common`](../type-aliases/Common.md)

Defined in: packages/common/types/presets/fraxtal.d.ts:21

Creates a common configuration for the fraxtal chain.

## Description

Chain ID: 252
Chain Name: Fraxtal
Default Block Explorer: https://fraxscan.com
Default RPC URL: https://rpc.frax.com

## Example

```ts
import { createMemoryClient } from 'tevm'
import { fraxtal } from 'tevm/common'
import { http } from 'tevm'

const client = createMemoryClient({
  common: fraxtal,
  fork: {
    transport: http({ url: 'https://example.com' })({})
  },
})
```
