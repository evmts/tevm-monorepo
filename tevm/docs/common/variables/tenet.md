[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [common](../README.md) / tenet

# Variable: tenet

> `const` **tenet**: [`Common`](../type-aliases/Common.md)

Defined in: packages/common/types/presets/tenet.d.ts:21

Creates a common configuration for the tenet chain.

## Description

Chain ID: 1559
Chain Name: Tenet
Default Block Explorer: https://tenetscan.io
Default RPC URL: https://rpc.tenet.org

## Example

```ts
import { createMemoryClient } from 'tevm'
import { tenet } from 'tevm/common'
import { http } from 'tevm'

const client = createMemoryClient({
  common: tenet,
  fork: {
    transport: http({ url: 'https://example.com' })({})
  },
})
```
