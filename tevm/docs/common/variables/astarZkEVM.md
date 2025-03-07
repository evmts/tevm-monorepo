[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [common](../README.md) / astarZkEVM

# Variable: astarZkEVM

> `const` **astarZkEVM**: [`Common`](../type-aliases/Common.md)

Defined in: packages/common/types/presets/astarZkEVM.d.ts:21

Creates a common configuration for the astarZkEVM chain.

## Description

Chain ID: 3776
Chain Name: Astar zkEVM
Default Block Explorer: https://astar-zkevm.explorer.startale.com
Default RPC URL: https://rpc.startale.com/astar-zkevm

## Example

```ts
import { createMemoryClient } from 'tevm'
import { astarZkEVM } from 'tevm/common'
import { http } from 'tevm'

const client = createMemoryClient({
  common: astarZkEVM,
  fork: {
    transport: http({ url: 'https://example.com' })({})
  },
})
```
