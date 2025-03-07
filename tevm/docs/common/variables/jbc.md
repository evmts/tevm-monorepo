[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [common](../README.md) / jbc

# Variable: jbc

> `const` **jbc**: [`Common`](../type-aliases/Common.md)

Defined in: packages/common/types/presets/jbc.d.ts:21

Creates a common configuration for the jbc chain.

## Description

Chain ID: 8899
Chain Name: JIBCHAIN L1
Default Block Explorer: https://exp-l1.jibchain.net
Default RPC URL: https://rpc-l1.jibchain.net

## Example

```ts
import { createMemoryClient } from 'tevm'
import { jbc } from 'tevm/common'
import { http } from 'tevm'

const client = createMemoryClient({
  common: jbc,
  fork: {
    transport: http({ url: 'https://example.com' })({})
  },
})
```
