[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [common](../README.md) / bronos

# Variable: bronos

> `const` **bronos**: [`Common`](../type-aliases/Common.md)

Defined in: packages/common/types/presets/bronos.d.ts:21

Creates a common configuration for the bronos chain.

## Description

Chain ID: 1039
Chain Name: Bronos
Default Block Explorer: https://broscan.bronos.org
Default RPC URL: https://evm.bronos.org

## Example

```ts
import { createMemoryClient } from 'tevm'
import { bronos } from 'tevm/common'
import { http } from 'tevm'

const client = createMemoryClient({
  common: bronos,
  fork: {
    transport: http({ url: 'https://example.com' })({})
  },
})
```
