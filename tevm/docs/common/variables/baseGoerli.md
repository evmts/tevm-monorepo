[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [common](../README.md) / baseGoerli

# Variable: baseGoerli

> `const` **baseGoerli**: [`Common`](../type-aliases/Common.md)

Defined in: packages/common/types/presets/baseGoerli.d.ts:21

Creates a common configuration for the baseGoerli chain.

## Description

Chain ID: 84531
Chain Name: Base Goerli
Default Block Explorer: https://goerli.basescan.org
Default RPC URL: https://goerli.base.org

## Example

```ts
import { createMemoryClient } from 'tevm'
import { baseGoerli } from 'tevm/common'
import { http } from 'tevm'

const client = createMemoryClient({
  common: baseGoerli,
  fork: {
    transport: http({ url: 'https://example.com' })({})
  },
})
```
