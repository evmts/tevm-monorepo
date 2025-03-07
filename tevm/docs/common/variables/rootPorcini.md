[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [common](../README.md) / rootPorcini

# Variable: rootPorcini

> `const` **rootPorcini**: [`Common`](../type-aliases/Common.md)

Defined in: packages/common/types/presets/rootPorcini.d.ts:21

Creates a common configuration for the rootPorcini chain.

## Description

Chain ID: 7672
Chain Name: The Root Network - Porcini
Default Block Explorer: https://porcini.rootscan.io
Default RPC URL: https://porcini.rootnet.app/archive

## Example

```ts
import { createMemoryClient } from 'tevm'
import { rootPorcini } from 'tevm/common'
import { http } from 'tevm'

const client = createMemoryClient({
  common: rootPorcini,
  fork: {
    transport: http({ url: 'https://example.com' })({})
  },
})
```
