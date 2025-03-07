[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [common](../README.md) / eon

# Variable: eon

> `const` **eon**: [`Common`](../type-aliases/Common.md)

Defined in: packages/common/types/presets/eon.d.ts:21

Creates a common configuration for the eon chain.

## Description

Chain ID: 7332
Chain Name: Horizen EON
Default Block Explorer: https://eon-explorer.horizenlabs.io
Default RPC URL: https://eon-rpc.horizenlabs.io/ethv1

## Example

```ts
import { createMemoryClient } from 'tevm'
import { eon } from 'tevm/common'
import { http } from 'tevm'

const client = createMemoryClient({
  common: eon,
  fork: {
    transport: http({ url: 'https://example.com' })({})
  },
})
```
