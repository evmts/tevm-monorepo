[**tevm**](../../README.md) • **Docs**

***

[tevm](../../modules.md) / [common](../README.md) / chips

# Variable: chips

> `const` **chips**: `Common`

Creates a common configuration for the chips chain.

## Description

Chain ID: 2882
Chain Name: Chips Network
Default Block Explorer: Not specified
Default RPC URL: https://node.chips.ooo/wasp/api/v1/chains/iota1pp3d3mnap3ufmgqnjsnw344sqmf5svjh26y2khnmc89sv6788y3r207a8fn/evm

## Example

```ts
import { createMemoryClient } from 'tevm'
import { chips } from 'tevm/common'
import { http } from 'tevm'

const client = createMemoryClient({
  common: chips,
  fork: {
    transport: http({ url: 'https://example.com' })({})
  },
})
```

## Defined in

packages/common/types/presets/chips.d.ts:21
