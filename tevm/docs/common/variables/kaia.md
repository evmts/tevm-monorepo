[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [common](../README.md) / kaia

# Variable: kaia

> `const` **kaia**: [`Common`](../type-aliases/Common.md)

Defined in: packages/common/types/presets/kaia.d.ts:21

Creates a common configuration for the kaia chain.

## Description

Chain ID: 8217
Chain Name: Kaia
Default Block Explorer: https://kaiascope.com
Default RPC URL: https://public-en.node.kaia.io

## Example

```ts
import { createMemoryClient } from 'tevm'
import { kaia } from 'tevm/common'
import { http } from 'tevm'

const client = createMemoryClient({
  common: kaia,
  fork: {
    transport: http({ url: 'https://example.com' })({})
  },
})
```
