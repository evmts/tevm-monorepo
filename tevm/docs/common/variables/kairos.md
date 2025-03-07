[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [common](../README.md) / kairos

# Variable: kairos

> `const` **kairos**: [`Common`](../type-aliases/Common.md)

Defined in: packages/common/types/presets/kairos.d.ts:21

Creates a common configuration for the kairos chain.

## Description

Chain ID: 1001
Chain Name: Kairos Testnet
Default Block Explorer: https://kairos.kaiascope.com
Default RPC URL: https://public-en-kairos.node.kaia.io

## Example

```ts
import { createMemoryClient } from 'tevm'
import { kairos } from 'tevm/common'
import { http } from 'tevm'

const client = createMemoryClient({
  common: kairos,
  fork: {
    transport: http({ url: 'https://example.com' })({})
  },
})
```
