[**tevm**](../../README.md) • **Docs**

***

[tevm](../../modules.md) / [common](../README.md) / metalL2

# Variable: metalL2

> `const` **metalL2**: `Common`

Creates a common configuration for the metalL2 chain.

## Description

Chain ID: 1750
Chain Name: Metal L2
Default Block Explorer: https://explorer.metall2.com
Default RPC URL: https://rpc.metall2.com

## Example

```ts
import { createMemoryClient } from 'tevm'
import { metalL2 } from 'tevm/common'
import { http } from 'tevm'

const client = createMemoryClient({
  common: metalL2,
  fork: {
    transport: http({ url: 'https://example.com' })({})
  },
})
```

## Defined in

packages/common/types/presets/metalL2.d.ts:21
