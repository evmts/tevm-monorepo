[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [common](../README.md) / ancient8

# Variable: ancient8

> `const` **ancient8**: [`Common`](../type-aliases/Common.md)

Defined in: packages/common/types/presets/ancient8.d.ts:21

Creates a common configuration for the ancient8 chain.

## Description

Chain ID: 888888888
Chain Name: Ancient8
Default Block Explorer: https://scan.ancient8.gg
Default RPC URL: https://rpc.ancient8.gg

## Example

```ts
import { createMemoryClient } from 'tevm'
import { ancient8 } from 'tevm/common'
import { http } from 'tevm'

const client = createMemoryClient({
  common: ancient8,
  fork: {
    transport: http({ url: 'https://example.com' })({})
  },
})
```
