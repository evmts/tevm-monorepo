[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [common](../README.md) / filecoinHyperspace

# Variable: filecoinHyperspace

> `const` **filecoinHyperspace**: [`Common`](../type-aliases/Common.md)

Defined in: packages/common/types/presets/filecoinHyperspace.d.ts:21

Creates a common configuration for the filecoinHyperspace chain.

## Description

Chain ID: 3141
Chain Name: Filecoin Hyperspace
Default Block Explorer: https://hyperspace.filfox.info/en
Default RPC URL: https://api.hyperspace.node.glif.io/rpc/v1

## Example

```ts
import { createMemoryClient } from 'tevm'
import { filecoinHyperspace } from 'tevm/common'
import { http } from 'tevm'

const client = createMemoryClient({
  common: filecoinHyperspace,
  fork: {
    transport: http({ url: 'https://example.com' })({})
  },
})
```
