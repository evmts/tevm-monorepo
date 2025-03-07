[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [common](../README.md) / meter

# Variable: meter

> `const` **meter**: [`Common`](../type-aliases/Common.md)

Defined in: packages/common/types/presets/meter.d.ts:21

Creates a common configuration for the meter chain.

## Description

Chain ID: 82
Chain Name: Meter
Default Block Explorer: https://scan.meter.io
Default RPC URL: https://rpc.meter.io

## Example

```ts
import { createMemoryClient } from 'tevm'
import { meter } from 'tevm/common'
import { http } from 'tevm'

const client = createMemoryClient({
  common: meter,
  fork: {
    transport: http({ url: 'https://example.com' })({})
  },
})
```
