[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [common](../README.md) / gnosis

# Variable: gnosis

> `const` **gnosis**: [`Common`](../type-aliases/Common.md)

Defined in: packages/common/types/presets/gnosis.d.ts:21

Creates a common configuration for the gnosis chain.

## Description

Chain ID: 100
Chain Name: Gnosis
Default Block Explorer: https://gnosisscan.io
Default RPC URL: https://rpc.gnosischain.com

## Example

```ts
import { createMemoryClient } from 'tevm'
import { gnosis } from 'tevm/common'
import { http } from 'tevm'

const client = createMemoryClient({
  common: gnosis,
  fork: {
    transport: http({ url: 'https://example.com' })({})
  },
})
```
